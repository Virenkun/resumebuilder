from fastapi import APIRouter, HTTPException, UploadFile, File
from app.services.claude_service import get_claude_service
from app.models.resume import Resume
from app.config import get_settings
import json
import os
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
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse resume (PDF/DOCX) using AI"""
    try:
        # Validate file type
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

        # Read file
        file_bytes = await file.read()

        # Check file size
        max_size = settings.max_file_size_mb * 1024 * 1024
        if len(file_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds {settings.max_file_size_mb}MB limit",
            )

        # Extract text
        if is_pdf:
            text = extract_text_from_pdf(file_bytes)
        else:
            text = extract_text_from_docx(file_bytes)

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from the uploaded file. The file may be image-based or empty.",
            )

        logger.info(f"Extracted {len(text)} characters from uploaded file")

        # Parse with Claude
        service = get_claude_service()
        result = await service.parse_resume(text, RESUME_SCHEMA)

        parsed = json.loads(result)

        # Ensure it has an ID
        resume_id = str(uuid4())
        parsed["id"] = resume_id

        # Ensure IDs on nested items
        for i, exp in enumerate(parsed.get("experience", [])):
            if not exp.get("id"):
                exp["id"] = str(uuid4())
        for i, edu in enumerate(parsed.get("education", [])):
            if not edu.get("id"):
                edu["id"] = str(uuid4())
        for i, proj in enumerate(parsed.get("projects", [])):
            if not proj.get("id"):
                proj["id"] = str(uuid4())

        # Save to storage
        resume_dir = os.path.join(settings.storage_path, resume_id)
        os.makedirs(resume_dir, exist_ok=True)

        with open(os.path.join(resume_dir, "data.json"), "w") as f:
            json.dump(parsed, f, indent=2)

        # Save original text for reference
        with open(os.path.join(resume_dir, "original.txt"), "w") as f:
            f.write(text)

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
