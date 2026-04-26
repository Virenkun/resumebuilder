from fastapi import APIRouter, Depends, HTTPException
from app.models.requests import ScoreRequest
from app.models.responses import ScoreResponse
from app.models.user import User
from app.deps.auth import get_current_user
from app.services import resume_storage
from app.services.ai_service import get_ai_service
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/score", response_model=ScoreResponse)
async def score_resume(
    request: ScoreRequest, user: User = Depends(get_current_user)
):
    """Score resume for ATS compatibility using AI"""
    try:
        resume_data = resume_storage.load_resume_or_404(user.id, request.resume_id)

        service = get_ai_service()
        result = await service.score_ats(
            json.dumps(resume_data), request.job_description
        )

        score_data = json.loads(result)

        resume_data.setdefault("metadata", {})
        resume_data["metadata"]["ats_score"] = score_data.get("score", 0)
        if request.job_description:
            resume_data["metadata"]["target_jd"] = request.job_description

        resume_storage.save_resume(user.id, request.resume_id, resume_data)

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
