from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.services.ai_service import get_ai_service
from app.services import resume_storage, resume_artifacts
from app.models.user import User
from app.deps.auth import get_current_user
from app.config import get_settings
import json
import logging
from uuid import uuid4

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()

RESUME_SCHEMA = """{
  "id": "string",
  "personal": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string or null",
    "github": "string or null",
    "website": "string or null"
  },
  "summary": "string or null",
  "experience": [
    {
      "id": "string",
      "company": "string",
      "position": "string",
      "location": "string",
      "start_date": "YYYY-MM",
      "end_date": "YYYY-MM or Present",
      "bullets": ["string"],
      "keywords": ["string"]
    }
  ],
  "education": [
    {
      "id": "string",
      "institution": "string",
      "degree": "string",
      "field": "string",
      "location": "string",
      "graduation_date": "YYYY-MM",
      "gpa": "string or null",
      "relevant_coursework": ["string"]
    }
  ],
  "skills": {
    "technical": ["string"],
    "languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"]
  },
  "projects": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "technologies": ["string"],
      "link": "string or null"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "YYYY-MM"
    }
  ],
  "metadata": {}
}"""


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from a PDF file"""
    from PyPDF2 import PdfReader
    from io import BytesIO

    reader = PdfReader(BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text.strip()


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from a DOCX file"""
    from docx import Document
    from io import BytesIO

    doc = Document(BytesIO(file_bytes))
    text = ""
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"
    return text.strip()


@router.post("/upload/resume")
async def upload_resume(
    file: UploadFile = File(...), user: User = Depends(get_current_user)
):
    """Upload and parse resume (PDF/DOCX) using AI"""
    try:
        content_type = file.content_type or ""
        filename = file.filename or ""

        is_pdf = content_type == "application/pdf" or filename.lower().endswith(".pdf")
        is_docx = (
            content_type
            == "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            or filename.lower().endswith(".docx")
        )

        if not is_pdf and not is_docx:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported",
            )

        file_bytes = await file.read()

        max_size = settings.max_file_size_mb * 1024 * 1024
        if len(file_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit",
            )

        text = extract_text_from_pdf(file_bytes) if is_pdf else extract_text_from_docx(file_bytes)

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the uploaded file. The file may be image-based or empty.",
            )

        logger.info(f"Extracted {len(text)} characters from uploaded file")

        service = get_ai_service()
        result = await service.parse_resume(text, RESUME_SCHEMA)

        try:
            parsed = json.loads(result)
        except json.JSONDecodeError as e:
            logger.error(
                "Parse-resume response was not valid JSON (%s). First 1000 chars:\n%s",
                e,
                (result or "")[:1000],
            )
            raise

        resume_id = str(uuid4())
        parsed["id"] = resume_id
        parsed["user_id"] = user.id

        for exp in parsed.get("experience", []):
            if not exp.get("id"):
                exp["id"] = str(uuid4())
        for edu in parsed.get("education", []):
            if not edu.get("id"):
                edu["id"] = str(uuid4())
        for proj in parsed.get("projects", []):
            if not proj.get("id"):
                proj["id"] = str(uuid4())

        resume_storage.save_resume(user.id, resume_id, parsed)

        # Save original extracted text as a storage artifact for reference.
        resume_artifacts.upload_artifact(
            user.id,
            resume_id,
            "original.txt",
            text.encode("utf-8"),
            content_type="text/plain; charset=utf-8",
        )

        return {
            "success": True,
            "message": "Resume parsed successfully",
            "resume": parsed,
        }

    except HTTPException:
        raise
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse resume structure from AI. Please try again.",
        )
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
