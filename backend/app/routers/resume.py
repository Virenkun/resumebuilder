from fastapi import APIRouter, Depends, HTTPException
from app.models.resume import Resume
from app.models.responses import ResumeResponse
from app.models.user import User
from app.deps.auth import get_current_user
from app.services import resume_storage

router = APIRouter()


@router.get("/resumes")
async def list_resumes(user: User = Depends(get_current_user)):
    """List all resumes for the authenticated user."""
    items = []
    for data in resume_storage.iter_user_resumes(user.id):
        personal = data.get("personal") or {}
        metadata = data.get("metadata") or {}
        experience = data.get("experience") or []
        latest_position = (
            (experience[0] or {}).get("position") if experience else None
        )
        items.append(
            {
                "id": data.get("id"),
                "name": personal.get("name", "") or "Untitled",
                "template": metadata.get("template", "jakes_resume"),
                "last_modified": metadata.get("last_modified"),
                "ats_score": metadata.get("ats_score"),
                "summary": data.get("summary"),
                "position": latest_position,
                "has_target_jd": bool(metadata.get("target_jd")),
                "experience_count": len(experience),
            }
        )
    return {"resumes": items}


@router.post("/resume/create", response_model=ResumeResponse)
async def create_resume(
    resume: Resume, user: User = Depends(get_current_user)
):
    """Create a new resume from form data"""
    try:
        resume.user_id = user.id
        resume_storage.save_resume(user.id, resume.id, resume.model_dump())

        return ResumeResponse(
            success=True,
            message="Resume created successfully",
            resume=resume,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/resume/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str, user: User = Depends(get_current_user)
):
    """Get resume by ID (must be owned by the authenticated user)."""
    data = resume_storage.load_resume_or_404(user.id, resume_id)
    resume = Resume(**data)
    return ResumeResponse(
        success=True, message="Resume retrieved successfully", resume=resume
    )


@router.put("/resume/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    resume: Resume,
    user: User = Depends(get_current_user),
):
    """Update existing resume (must be owned by the authenticated user)."""
    # Ownership check — raises 403 if another user owns it
    resume_storage.load_resume_or_404(user.id, resume_id)
    resume.user_id = user.id
    resume_storage.save_resume(user.id, resume_id, resume.model_dump())
    return ResumeResponse(
        success=True, message="Resume updated successfully", resume=resume
    )


@router.delete("/resume/{resume_id}")
async def delete_resume(
    resume_id: str, user: User = Depends(get_current_user)
):
    """Delete resume (must be owned by the authenticated user)."""
    resume_storage.delete_resume(user.id, resume_id)
    return {"success": True, "message": "Resume deleted successfully"}
