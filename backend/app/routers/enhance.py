from fastapi import APIRouter, Depends, HTTPException
from app.models.requests import EnhanceRequest, TailorRequest, GenerateFromJDRequest
from app.models.responses import EnhanceResponse
from app.models.user import User
from app.deps.auth import get_current_user
from app.services import resume_storage, resume_artifacts
from app.services.ai_service import get_ai_service
import json
import logging
import re

logger = logging.getLogger(__name__)
router = APIRouter()


def _extract_json(raw: str):
    """Tolerant JSON extraction — handles markdown fences and surrounding prose."""
    if raw is None:
        raise ValueError("empty response")
    s = raw.strip()

    fence = re.match(r"^```(?:json)?\s*\n?(.*?)\n?```$", s, re.DOTALL | re.IGNORECASE)
    if fence:
        s = fence.group(1).strip()

    try:
        return json.loads(s)
    except json.JSONDecodeError:
        pass

    for opener, closer in (("{", "}"), ("[", "]")):
        start = s.find(opener)
        end = s.rfind(closer)
        if start != -1 and end != -1 and end > start:
            try:
                return json.loads(s[start : end + 1])
            except json.JSONDecodeError:
                continue

    raise json.JSONDecodeError("No valid JSON found in response", s, 0)


@router.post("/enhance", response_model=EnhanceResponse)
async def enhance_bullets(
    request: EnhanceRequest, user: User = Depends(get_current_user)
):
    """Enhance resume bullet points using AI"""
    try:
        service = get_ai_service()
        result = await service.enhance_bullets(request.bullets, instruction=request.instruction)

        enhanced = json.loads(result)

        if not isinstance(enhanced, list):
            raise ValueError("Expected a JSON array of enhanced bullets")

        return EnhanceResponse(
            success=True,
            enhanced_bullets=enhanced,
            original_bullets=request.bullets,
        )
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse Claude response as JSON: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to parse AI response. Please try again.",
        )
    except Exception as e:
        logger.error(f"Enhancement failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tailor")
async def tailor_to_jd(
    request: TailorRequest, user: User = Depends(get_current_user)
):
    """Tailor an existing resume to match a job description"""
    try:
        resume_data = resume_storage.load_resume_or_404(user.id, request.resume_id)

        service = get_ai_service()
        result = await service.tailor_to_jd(
            json.dumps(resume_data), request.job_description
        )

        try:
            parsed = _extract_json(result)
        except json.JSONDecodeError:
            logger.error(
                "Tailor response was not valid JSON. First 1000 chars:\n%s",
                (result or "")[:1000],
            )
            raise

        if isinstance(parsed, dict) and "resume" in parsed and isinstance(
            parsed["resume"], dict
        ):
            tailored = parsed["resume"]
            rationale = parsed.get("rationale") or {}
        else:
            tailored = parsed
            rationale = {}

        resume_artifacts.upload_artifact(
            user.id,
            request.resume_id,
            "tailored.json",
            json.dumps(tailored, indent=2).encode("utf-8"),
            content_type="application/json",
        )
        resume_artifacts.upload_artifact(
            user.id,
            request.resume_id,
            "tailored_rationale.json",
            json.dumps(rationale, indent=2).encode("utf-8"),
            content_type="application/json",
        )

        return {
            "success": True,
            "message": "Resume tailored successfully",
            "resume": tailored,
            "rationale": rationale,
        }
    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, detail="Failed to parse AI response. Please try again."
        )
    except Exception as e:
        logger.error(f"Tailoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/tailor/{resume_id}/diff")
async def get_tailor_diff(
    resume_id: str, user: User = Depends(get_current_user)
):
    """Return the original and tailored resumes for side-by-side review."""
    # Ownership-checked load of original
    original = resume_storage.load_resume_or_404(user.id, resume_id)

    tailored_bytes = resume_artifacts.download_artifact(user.id, resume_id, "tailored.json")
    if tailored_bytes is None:
        raise HTTPException(
            status_code=404,
            detail="No tailored version found. Run /tailor first.",
        )
    tailored = json.loads(tailored_bytes.decode("utf-8"))

    rationale_bytes = resume_artifacts.download_artifact(
        user.id, resume_id, "tailored_rationale.json"
    )
    rationale: dict = (
        json.loads(rationale_bytes.decode("utf-8")) if rationale_bytes else {}
    )

    return {
        "success": True,
        "original": original,
        "tailored": tailored,
        "rationale": rationale,
    }


@router.post("/generate-from-jd")
async def generate_from_jd(
    request: GenerateFromJDRequest, user: User = Depends(get_current_user)
):
    """Generate a resume structure from a job description"""
    try:
        service = get_ai_service()
        result = await service.generate_from_jd(
            request.job_description, request.user_info
        )

        generated = json.loads(result)

        return {
            "success": True,
            "message": "Resume generated from job description",
            "resume": generated,
        }
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500, detail="Failed to parse AI response. Please try again."
        )
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
