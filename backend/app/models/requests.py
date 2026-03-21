from pydantic import BaseModel
from typing import List, Optional


class CreateResumeRequest(BaseModel):
    """Request model for creating a resume from form data"""
    pass  # Will use Resume model directly


class ParseResumeRequest(BaseModel):
    """Request model for parsing an uploaded resume"""
    pass  # File upload handled by FastAPI's UploadFile


class EnhanceRequest(BaseModel):
    """Request model for enhancing bullet points"""
    bullets: List[str]
    instruction: Optional[str] = None


class TailorRequest(BaseModel):
    """Request model for tailoring resume to JD"""
    resume_id: str
    job_description: str


class GenerateFromJDRequest(BaseModel):
    """Request model for generating resume from JD"""
    job_description: str
    user_info: Optional[dict] = None  # Optional basic info


class CompileRequest(BaseModel):
    """Request model for compiling resume to PDF"""
    resume_id: str
    template: str = "jakes_resume"


class ScoreRequest(BaseModel):
    """Request model for scoring resume ATS compatibility"""
    resume_id: str
    job_description: Optional[str] = None
