from anthropic import Anthropic, AnthropicError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class ClaudeService:
    """Service for interacting with Claude API"""

    def __init__(self):
        self.client = Anthropic(api_key=settings.anthropic_api_key)
        self.model = settings.claude_model
        self.max_tokens = settings.claude_max_tokens
        self.temperature = settings.claude_temperature

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type(AnthropicError),
        reraise=True
    )
    async def create_message(
        self,
        prompt: str,
        system_prompt: str = "",
        max_tokens: int = None,
        temperature: float = None
    ) -> str:
        """
        Create a message with Claude API with retry logic

        Args:
            prompt: The user prompt
            system_prompt: Optional system prompt
            max_tokens: Maximum tokens for response (defaults to config value)
            temperature: Temperature for sampling (defaults to config value)

        Returns:
            The text content from Claude's response
        """
        try:
            messages = [{"role": "user", "content": prompt}]

            kwargs = {
                "model": self.model,
                "max_tokens": max_tokens or self.max_tokens,
                "temperature": temperature or self.temperature,
                "messages": messages
            }

            if system_prompt:
                kwargs["system"] = system_prompt

            logger.info(f"Sending request to Claude API with model {self.model}")

            response = self.client.messages.create(**kwargs)

            # Extract text content from response
            if response.content and len(response.content) > 0:
                result = response.content[0].text
                logger.info(f"Received response from Claude: {len(result)} characters")
                return result
            else:
                logger.error("Empty response from Claude API")
                raise ValueError("Empty response from Claude API")

        except AnthropicError as e:
            logger.error(f"Anthropic API error: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error in Claude service: {str(e)}")
            raise

    async def parse_resume(self, resume_text: str, schema: str) -> str:
        """Parse resume text into structured JSON"""
        from app.utils.prompt_templates import PARSE_RESUME_PROMPT

        prompt = PARSE_RESUME_PROMPT.format(
            schema=schema,
            resume_text=resume_text
        )

        return await self.create_message(prompt, temperature=0.3)

    async def enhance_bullets(self, bullets: list[str], instruction: str = None) -> str:
        """Enhance resume bullet points"""
        from app.utils.prompt_templates import ENHANCE_BULLETS_PROMPT, ENHANCE_BULLETS_WITH_INSTRUCTION_PROMPT

        bullets_text = "\n".join(f"- {bullet}" for bullet in bullets)
        if instruction:
            prompt = ENHANCE_BULLETS_WITH_INSTRUCTION_PROMPT.format(
                bullets=bullets_text, instruction=instruction
            )
        else:
            prompt = ENHANCE_BULLETS_PROMPT.format(bullets=bullets_text)

        return await self.create_message(prompt, temperature=0.7)

    async def tailor_to_jd(self, resume_json: str, jd_text: str) -> str:
        """Tailor resume to job description"""
        from app.utils.prompt_templates import TAILOR_TO_JD_PROMPT

        prompt = TAILOR_TO_JD_PROMPT.format(
            resume_json=resume_json,
            jd_text=jd_text
        )

        return await self.create_message(prompt, temperature=0.5)

    async def generate_from_jd(self, jd_text: str, user_info: dict = None) -> str:
        """Generate resume structure from job description"""
        from app.utils.prompt_templates import GENERATE_FROM_JD_PROMPT

        prompt = GENERATE_FROM_JD_PROMPT.format(jd_text=jd_text)

        return await self.create_message(prompt, temperature=0.6)

    async def score_ats(self, resume_json: str, jd_text: str = None) -> str:
        """Score resume for ATS compatibility"""
        from app.utils.prompt_templates import SCORE_ATS_PROMPT_GENERAL, SCORE_ATS_PROMPT_WITH_JD

        if jd_text:
            prompt = SCORE_ATS_PROMPT_WITH_JD.format(
                resume_json=resume_json,
                jd_text=jd_text
            )
        else:
            prompt = SCORE_ATS_PROMPT_GENERAL.format(resume_json=resume_json)

        return await self.create_message(prompt, temperature=0.3)


# Singleton instance
_claude_service = None


def get_claude_service() -> ClaudeService:
    """Get singleton Claude service instance"""
    global _claude_service
    if _claude_service is None:
        _claude_service = ClaudeService()
    return _claude_service
