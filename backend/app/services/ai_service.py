from openai import OpenAI, OpenAIError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.config import get_settings
import logging
import re

logger = logging.getLogger(__name__)
settings = get_settings()


def _strip_json_wrapping(raw: str) -> str:
    """Strip markdown code fences and surrounding prose from a JSON string."""
    if not raw:
        return raw
    s = raw.strip()

    fence = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```$", s, re.DOTALL | re.IGNORECASE)
    if fence:
        s = fence.group(1).strip()

    if s.startswith("{") or s.startswith("["):
        return s

    for opener, closer in (("{", "}"), ("[", "]")):
        start = s.find(opener)
        end = s.rfind(closer)
        if start != -1 and end != -1 and end > start:
            return s[start : end + 1]

    return s


class AIService:
    """Service for interacting with OpenAI GPT API"""

    def __init__(self):
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
        self.max_tokens = settings.openai_max_tokens
        self.temperature = settings.openai_temperature

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(OpenAIError),
        reraise=True,
    )
    async def create_message(
        self,
        prompt: str,
        system_prompt: str = "",
        max_tokens: int = None,
        temperature: float = None,
        json_mode: bool = False,
    ) -> str:
        """Create a chat completion with GPT, with retry on API errors."""
        try:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.append({"role": "user", "content": prompt})

            kwargs = {
                "model": self.model,
                "max_tokens": max_tokens or self.max_tokens,
                "temperature": temperature if temperature is not None else self.temperature,
                "messages": messages,
            }
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}

            logger.info(f"Sending request to OpenAI with model {self.model}")
            response = self.client.chat.completions.create(**kwargs)

            if response.choices and response.choices[0].message.content:
                result = response.choices[0].message.content
                logger.info(f"Received response from OpenAI: {len(result)} characters")
                return _strip_json_wrapping(result) if json_mode else result

            logger.error("Empty response from OpenAI API")
            raise ValueError("Empty response from OpenAI API")

        except OpenAIError as e:
            logger.error(f"OpenAI API error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in AI service: {str(e)}")
            raise

    async def parse_resume(self, resume_text: str, schema: str) -> str:
        from app.utils.prompt_templates import PARSE_RESUME_PROMPT

        prompt = PARSE_RESUME_PROMPT.format(schema=schema, resume_text=resume_text)
        return await self.create_message(prompt, temperature=0.3, json_mode=True)

    async def enhance_bullets(self, bullets: list[str], instruction: str = None) -> str:
        from app.utils.prompt_templates import (
            ENHANCE_BULLETS_PROMPT,
            ENHANCE_BULLETS_WITH_INSTRUCTION_PROMPT,
        )

        bullets_text = "\n".join(f"- {bullet}" for bullet in bullets)
        if instruction:
            prompt = ENHANCE_BULLETS_WITH_INSTRUCTION_PROMPT.format(
                bullets=bullets_text, instruction=instruction
            )
        else:
            prompt = ENHANCE_BULLETS_PROMPT.format(bullets=bullets_text)

        # json_object mode requires an object, not a bare array — wrap in object via prompt handling in caller
        raw = await self.create_message(prompt, temperature=0.7)
        return _strip_json_wrapping(raw)

    async def tailor_to_jd(self, resume_json: str, jd_text: str) -> str:
        from app.utils.prompt_templates import TAILOR_TO_JD_PROMPT

        prompt = TAILOR_TO_JD_PROMPT.format(resume_json=resume_json, jd_text=jd_text)
        return await self.create_message(
            prompt, temperature=0.5, max_tokens=8192, json_mode=True
        )

    async def generate_from_jd(self, jd_text: str, user_info: dict = None) -> str:
        from app.utils.prompt_templates import GENERATE_FROM_JD_PROMPT

        prompt = GENERATE_FROM_JD_PROMPT.format(jd_text=jd_text)
        return await self.create_message(prompt, temperature=0.6, json_mode=True)

    async def score_ats(self, resume_json: str, jd_text: str = None) -> str:
        from app.utils.prompt_templates import (
            SCORE_ATS_PROMPT_GENERAL,
            SCORE_ATS_PROMPT_WITH_JD,
        )

        if jd_text:
            prompt = SCORE_ATS_PROMPT_WITH_JD.format(
                resume_json=resume_json, jd_text=jd_text
            )
        else:
            prompt = SCORE_ATS_PROMPT_GENERAL.format(resume_json=resume_json)

        return await self.create_message(prompt, temperature=0.3, json_mode=True)


_ai_service = None


def get_ai_service() -> AIService:
    """Get singleton AI service instance."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
