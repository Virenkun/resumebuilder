from fastapi import APIRouter, HTTPException, Depends
from app.models.resume import Resume
from app.models.responses import ResumeResponse, ErrorResponse
from app.config import get_settings
import json
import os
from typing import Optional

router = APIRouter()
settings = get_settings()


@router.post("/resume/create", response_model=ResumeResponse)
async def create_resume(resume: Resume):
    """Create a new resume from form data"""
    try:
        # Save resume to storage
        resume_dir = os.path.join(settings.storage_path, resume.id)
        os.makedirs(resume_dir, exist_ok=True)

        resume_file = os.path.join(resume_dir, "data.json")
        with open(resume_file, "w") as f:
            json.dump(resume.model_dump(), f, indent=2)

        return ResumeResponse(
            success=True,
            message="Resume created successfully",
            resume=resume
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/resume/{resume_id}", response_model=ResumeResponse)
async def get_resume(resume_id: str):
    """Get resume by ID"""
    try:
        resume_file = os.path.join(settings.storage_path, resume_id, "data.json")

        if not os.path.exists(resume_file):
            raise HTTPException(status_code=404, detail="Resume not found")

        with open(resume_file, "r") as f:
            resume_data = json.load(f)

        resume = Resume(**resume_data)
        return ResumeResponse(
            success=True,
            message="Resume retrieved successfully",
            resume=resume
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.put("/resume/{resume_id}", response_model=ResumeResponse)
async def update_resume(resume_id: str, resume: Resume):
    """Update existing resume"""
    try:
        resume_dir = os.path.join(settings.storage_path, resume_id)

        if not os.path.exists(resume_dir):
            raise HTTPException(status_code=404, detail="Resume not found")

        resume_file = os.path.join(resume_dir, "data.json")
        with open(resume_file, "w") as f:
            json.dump(resume.model_dump(), f, indent=2)

        return ResumeResponse(
            success=True,
            message="Resume updated successfully",
            resume=resume
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete resume"""
    try:
        resume_dir = os.path.join(settings.storage_path, resume_id)

        if not os.path.exists(resume_dir):
            raise HTTPException(status_code=404, detail="Resume not found")

        import shutil
        shutil.rmtree(resume_dir)

        return {"success": True, "message": "Resume deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
