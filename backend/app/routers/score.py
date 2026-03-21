from fastapi import APIRouter, HTTPException
from app.models.requests import ScoreRequest
from app.models.responses import ScoreResponse
from app.services.claude_service import get_claude_service
from app.config import get_settings
import json
import os
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


@router.post("/score", response_model=ScoreResponse)
async def score_resume(request: ScoreRequest):
    """Score resume for ATS compatibility using AI"""
    try:
        # Load resume data
        resume_file = os.path.join(settings.storage_path, request.resume_id, "data.json")

        if not os.path.exists(resume_file):
            raise HTTPException(status_code=404, detail="Resume not found")

        with open(resume_file, "r") as f:
            resume_data = json.load(f)

        service = get_claude_service()
        result = await service.score_ats(
            json.dumps(resume_data), request.job_description
        )

        score_data = json.loads(result)

        # Update resume metadata with score
        resume_data.setdefault("metadata", {})
        resume_data["metadata"]["ats_score"] = score_data.get("score", 0)
        if request.job_description:
            resume_data["metadata"]["target_jd"] = request.job_description

        with open(resume_file, "w") as f:
            json.dump(resume_data, f, indent=2)

        return ScoreResponse(
            score=score_data.get("score", 0),
            keyword_match=score_data.get("keyword_match"),
            issues=score_data.get("issues", {"critical": [], "recommended": [], "optional": []}),
            suggestions=score_data.get("suggestions", []),
        )

    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse scoring response. Please try again.",
        )
    except Exception as e:
        logger.error(f"Scoring failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
