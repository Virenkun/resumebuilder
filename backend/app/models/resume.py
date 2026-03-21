from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from uuid import uuid4


class PersonalInfo(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: str
    location: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None


class Experience(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    company: str
    position: str
    location: str
    start_date: str  # YYYY-MM format
    end_date: str  # YYYY-MM or "Present"
    bullets: List[str]
    keywords: List[str] = Field(default_factory=list)


class Education(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    institution: str
    degree: str
    field: str
    location: str
    graduation_date: str  # YYYY-MM format
    gpa: Optional[str] = None
    relevant_coursework: List[str] = Field(default_factory=list)


class Skills(BaseModel):
    technical: List[str] = Field(default_factory=list)
    languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)


class Project(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: str
    technologies: List[str]
    link: Optional[str] = None


class Certification(BaseModel):
    name: str
    issuer: str
    date: str  # YYYY-MM format


class ResumeMetadata(BaseModel):
    template: Optional[str] = "jakes_resume"
    last_modified: Optional[str] = None
    target_jd: Optional[str] = None
    ats_score: Optional[float] = None


class Resume(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    personal: PersonalInfo
    summary: Optional[str] = None
    experience: List[Experience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)
    skills: Skills = Field(default_factory=Skills)
    projects: List[Project] = Field(default_factory=list)
    certifications: List[Certification] = Field(default_factory=list)
    metadata: ResumeMetadata = Field(default_factory=ResumeMetadata)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "personal": {
                    "name": "John Doe",
                    "email": "john@example.com",
                    "phone": "+1-234-567-8900",
                    "location": "San Francisco, CA",
                    "linkedin": "linkedin.com/in/johndoe",
                    "github": "github.com/johndoe"
                },
                "summary": "Experienced software engineer with 5+ years...",
                "experience": [
                    {
                        "id": "exp-1",
                        "company": "Tech Corp",
                        "position": "Senior Software Engineer",
                        "location": "San Francisco, CA",
                        "start_date": "2020-01",
                        "end_date": "Present",
                        "bullets": [
                            "Led development of microservices architecture",
                            "Improved system performance by 40%"
                        ],
                        "keywords": ["Python", "AWS", "Kubernetes"]
                    }
                ],
                "education": [
                    {
                        "id": "edu-1",
                        "institution": "Stanford University",
                        "degree": "Bachelor of Science",
                        "field": "Computer Science",
                        "location": "Stanford, CA",
                        "graduation_date": "2018-06",
                        "gpa": "3.8"
                    }
                ],
                "skills": {
                    "technical": ["Python", "JavaScript", "Go"],
                    "frameworks": ["React", "FastAPI", "Django"],
                    "tools": ["Docker", "Kubernetes", "Git"],
                    "languages": ["English", "Spanish"]
                },
                "projects": [],
                "certifications": [],
                "metadata": {
                    "template": "jakes_resume",
                    "last_modified": "2026-03-21T00:00:00Z"
                }
            }
        }
