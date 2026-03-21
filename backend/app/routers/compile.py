from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.models.requests import CompileRequest
from app.config import get_settings
from jinja2 import Environment, FileSystemLoader
import json
import os
import subprocess
import tempfile
import shutil
import logging
import re

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


def escape_latex(text: str) -> str:
    """Escape special LaTeX characters in text"""
    if not text:
        return ""
    # Characters that need escaping in LaTeX
    chars = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
    }
    # Don't escape backslashes that are already LaTeX commands
    escaped = text
    for char, replacement in chars.items():
        escaped = escaped.replace(char, replacement)
    return escaped


def prepare_template_data(resume_data: dict) -> dict:
    """Prepare resume data for LaTeX template injection with proper escaping"""
    personal = resume_data.get("personal", {})

    data = {
        "name": escape_latex(personal.get("name", "")),
        "email": personal.get("email", ""),  # Don't escape emails (used in href)
        "phone": escape_latex(personal.get("phone", "")),
        "location": escape_latex(personal.get("location", "")),
        "linkedin": personal.get("linkedin", ""),
        "github": personal.get("github", ""),
        "website": personal.get("website", ""),
        "summary": escape_latex(resume_data.get("summary", "") or ""),
    }

    # Experience
    experience = []
    for exp in resume_data.get("experience", []):
        experience.append({
            "company": escape_latex(exp.get("company", "")),
            "position": escape_latex(exp.get("position", "")),
            "location": escape_latex(exp.get("location", "")),
            "start_date": escape_latex(exp.get("start_date", "")),
            "end_date": escape_latex(exp.get("end_date", "")),
            "bullets": [escape_latex(b) for b in exp.get("bullets", [])],
        })
    data["experience"] = experience

    # Education
    education = []
    for edu in resume_data.get("education", []):
        education.append({
            "institution": escape_latex(edu.get("institution", "")),
            "degree": escape_latex(edu.get("degree", "")),
            "field": escape_latex(edu.get("field", "")),
            "location": escape_latex(edu.get("location", "")),
            "graduation_date": escape_latex(edu.get("graduation_date", "")),
            "gpa": escape_latex(edu.get("gpa", "") or ""),
        })
    data["education"] = education

    # Skills
    skills = resume_data.get("skills", {})
    data["skills"] = {
        "technical": [escape_latex(s) for s in skills.get("technical", [])],
        "frameworks": [escape_latex(s) for s in skills.get("frameworks", [])],
        "tools": [escape_latex(s) for s in skills.get("tools", [])],
        "languages": [escape_latex(s) for s in skills.get("languages", [])],
    }
    data["has_skills"] = any(
        len(v) > 0 for v in data["skills"].values()
    )

    # Projects
    projects = []
    for proj in resume_data.get("projects", []):
        projects.append({
            "name": escape_latex(proj.get("name", "")),
            "description": escape_latex(proj.get("description", "")),
            "technologies": [escape_latex(t) for t in proj.get("technologies", [])],
            "link": proj.get("link", ""),
        })
    data["projects"] = projects

    # Certifications
    certifications = []
    for cert in resume_data.get("certifications", []):
        certifications.append({
            "name": escape_latex(cert.get("name", "")),
            "issuer": escape_latex(cert.get("issuer", "")),
            "date": escape_latex(cert.get("date", "")),
        })
    data["certifications"] = certifications

    return data


def render_latex(template_name: str, data: dict) -> str:
    """Render LaTeX template with Jinja2"""
    templates_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
        "templates",
    )

    env = Environment(
        loader=FileSystemLoader(os.path.join(templates_dir, template_name)),
        block_start_string="<%",
        block_end_string="%>",
        variable_start_string="<<",
        variable_end_string=">>",
        comment_start_string="<#",
        comment_end_string="#>",
    )

    template = env.get_template("template.tex")
    return template.render(**data)


@router.post("/compile")
async def compile_resume(request: CompileRequest):
    """Compile resume to PDF using LaTeX"""
    try:
        # Load resume data
        resume_file = os.path.join(
            settings.storage_path, request.resume_id, "data.json"
        )
        if not os.path.exists(resume_file):
            raise HTTPException(status_code=404, detail="Resume not found")

        with open(resume_file, "r") as f:
            resume_data = json.load(f)

        # Prepare data and render template
        template_data = prepare_template_data(resume_data)
        latex_source = render_latex(request.template, template_data)

        # Save LaTeX source
        resume_dir = os.path.join(settings.storage_path, request.resume_id)
        latex_file = os.path.join(resume_dir, "resume.tex")
        with open(latex_file, "w") as f:
            f.write(latex_source)

        # Compile LaTeX to PDF
        pdf_file = os.path.join(resume_dir, "resume.pdf")

        # Try xelatex first (for fontspec support), then tectonic, fall back to pdflatex
        compiled = False
        for compiler in ["xelatex", "tectonic", "pdflatex"]:
            if shutil.which(compiler):
                try:
                    if compiler == "tectonic":
                        cmd = ["tectonic", latex_file, "-o", resume_dir]
                    elif compiler == "xelatex":
                        cmd = [
                            "xelatex",
                            "-interaction=nonstopmode",
                            f"-output-directory={resume_dir}",
                            latex_file,
                        ]
                    else:
                        cmd = [
                            "pdflatex",
                            "-interaction=nonstopmode",
                            f"-output-directory={resume_dir}",
                            latex_file,
                        ]

                    result = subprocess.run(
                        cmd,
                        capture_output=True,
                        text=True,
                        timeout=settings.latex_compile_timeout,
                    )

                    if os.path.exists(pdf_file):
                        compiled = True
                        logger.info(f"Successfully compiled with {compiler}")
                        break
                    else:
                        logger.warning(
                            f"{compiler} did not produce PDF. stderr: {result.stderr[:500]}"
                        )
                except subprocess.TimeoutExpired:
                    logger.warning(f"{compiler} timed out")
                except Exception as e:
                    logger.warning(f"{compiler} failed: {e}")

        if not compiled:
            # Return the LaTeX source even if compilation fails
            return {
                "success": False,
                "message": "LaTeX compilation failed. No LaTeX compiler (tectonic/pdflatex) available. You can download the .tex source and compile locally.",
                "latex_available": True,
                "download_url": f"/api/download/latex/{request.resume_id}",
            }

        # Clean up auxiliary files
        for ext in [".aux", ".log", ".out"]:
            aux_file = os.path.join(resume_dir, f"resume{ext}")
            if os.path.exists(aux_file):
                os.remove(aux_file)

        return {
            "success": True,
            "message": "Resume compiled successfully",
            "download_url": f"/api/download/pdf/{request.resume_id}",
            "latex_url": f"/api/download/latex/{request.resume_id}",
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Compilation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download/pdf/{resume_id}")
async def download_pdf(resume_id: str):
    """Download compiled PDF"""
    pdf_path = os.path.join(settings.storage_path, resume_id, "resume.pdf")

    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found. Please compile first.")

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="resume.pdf",
    )


@router.get("/download/latex/{resume_id}")
async def download_latex(resume_id: str):
    """Download LaTeX source"""
    tex_path = os.path.join(settings.storage_path, resume_id, "resume.tex")

    if not os.path.exists(tex_path):
        raise HTTPException(status_code=404, detail="LaTeX source not found. Please compile first.")

    return FileResponse(
        tex_path,
        media_type="application/x-tex",
        filename="resume.tex",
    )
