from fastapi import APIRouter, HTTPException, Depends
from app.models.requests import EnhanceRequest, TailorRequest, GenerateFromJDRequest
from app.models.responses import EnhanceResponse
from app.services.claude_service import get_claude_service, ClaudeService
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/enhance", response_model=EnhanceResponse)
async def enhance_bullets(request: EnhanceRequest):
    """Enhance resume bullet points using AI"""
    try:
        service = get_claude_service()
        result = await service.enhance_bullets(request.bullets, instruction=request.instruction)

        # Parse the JSON array response
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
async def tailor_to_jd(request: TailorRequest):
    """Tailor an existing resume to match a job description"""
    try:
        from app.config import get_settings
        import os

        settings = get_settings()

        # Load existing resume
        resume_file = os.path.join(settings.storage_path, request.resume_id, "data.json")
        if not os.path.exists(resume_file):
            raise HTTPException(status_code=404, detail="Resume not found")

        with open(resume_file, "r") as f:
            resume_data = json.load(f)

        service = get_claude_service()
        result = await service.tailor_to_jd(
            json.dumps(resume_data), request.job_description
        )

        tailored = json.loads(result)

        # Save tailored version
        tailored_file = os.path.join(
            settings.storage_path, request.resume_id, "tailored.json"
        )
        with open(tailored_file, "w") as f:
            json.dump(tailored, f, indent=2)

        return {
            "success": True,
            "message": "Resume tailored successfully",
            "resume": tailored,
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


@router.post("/generate-from-jd")
async def generate_from_jd(request: GenerateFromJDRequest):
    """Generate a resume structure from a job description"""
    try:
        service = get_claude_service()
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
