from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.models.resume import Resume


class ResumeResponse(BaseModel):
    """Standard response for resume operations"""
    success: bool
    message: str
    resume: Optional[Resume] = None


class ParseResponse(BaseModel):
    """Response for resume parsing"""
    success: bool
    message: str
    resume: Resume


class EnhanceResponse(BaseModel):
    """Response for bullet enhancement"""
    success: bool
    enhanced_bullets: List[str]
    original_bullets: List[str]


class CompileResponse(BaseModel):
    """Response for PDF compilation"""
    success: bool
    message: str
    download_url: Optional[str] = None


class ScoreResponse(BaseModel):
    """Response for ATS scoring"""
    score: float
    keyword_match: Optional[float] = None
    issues: Dict[str, List[str]] = {
        "critical": [],
        "recommended": [],
        "optional": []
    }
    suggestions: List[str] = []


class ErrorResponse(BaseModel):
    """Standard error response"""
    success: bool = False
    error: str
    detail: Optional[str] = None
