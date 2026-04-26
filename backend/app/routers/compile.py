from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from app.models.requests import CompileRequest
from app.models.user import User
from app.deps.auth import get_current_user
from app.services import resume_storage, resume_artifacts
from app.services.template_repository import get_template_repository
from app.config import get_settings
from jinja2 import Environment, BaseLoader
import os
import subprocess
import shutil
import tempfile
import logging

logger = logging.getLogger(__name__)
router = APIRouter()
settings = get_settings()


def escape_latex(text: str) -> str:
    """Escape special LaTeX characters in text"""
    if not text:
        return ""
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
    escaped = text
    for char, replacement in chars.items():
        escaped = escaped.replace(char, replacement)
    return escaped


def prepare_template_data(resume_data: dict) -> dict:
    """Prepare resume data for LaTeX template injection with proper escaping"""
    personal = resume_data.get("personal", {})

    data = {
        "name": escape_latex(personal.get("name", "")),
        "email": personal.get("email", ""),
        "phone": escape_latex(personal.get("phone", "")),
        "location": escape_latex(personal.get("location", "")),
        "linkedin": personal.get("linkedin", ""),
        "github": personal.get("github", ""),
        "website": personal.get("website", ""),
        "summary": escape_latex(resume_data.get("summary", "") or ""),
    }

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

    skills = resume_data.get("skills", {})
    data["skills"] = {
        "technical": [escape_latex(s) for s in skills.get("technical", [])],
        "frameworks": [escape_latex(s) for s in skills.get("frameworks", [])],
        "tools": [escape_latex(s) for s in skills.get("tools", [])],
        "languages": [escape_latex(s) for s in skills.get("languages", [])],
    }
    data["has_skills"] = any(len(v) > 0 for v in data["skills"].values())

    projects = []
    for proj in resume_data.get("projects", []):
        projects.append({
            "name": escape_latex(proj.get("name", "")),
            "description": escape_latex(proj.get("description", "")),
            "technologies": [escape_latex(t) for t in proj.get("technologies", [])],
            "link": proj.get("link", ""),
        })
    data["projects"] = projects

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
    """Render a Supabase-hosted LaTeX template with Jinja2."""
    repo = get_template_repository()
    tex_source = repo.get_tex(template_name)

    env = Environment(
        loader=BaseLoader(),
        block_start_string="<%",
        block_end_string="%>",
        variable_start_string="<<",
        variable_end_string=">>",
        comment_start_string="<#",
        comment_end_string="#>",
        autoescape=False,
    )

    template = env.from_string(tex_source)
    return template.render(**data)


@router.post("/compile")
async def compile_resume(
    request: CompileRequest, user: User = Depends(get_current_user)
):
    """Compile resume to PDF using LaTeX"""
    try:
        # Ownership-checked load
        resume_data = resume_storage.load_resume_or_404(user.id, request.resume_id)

        template_data = prepare_template_data(resume_data)
        latex_source = render_latex(request.template, template_data)

        # LaTeX compilers need a real filesystem. Work in a tempdir, upload outputs.
        with tempfile.TemporaryDirectory(prefix="latex-") as work_dir:
            latex_file = os.path.join(work_dir, "resume.tex")
            with open(latex_file, "w") as f:
                f.write(latex_source)

            # Always persist the .tex source so users can download it even if
            # compilation fails.
            resume_artifacts.upload_artifact(
                user.id,
                request.resume_id,
                "resume.tex",
                latex_source.encode("utf-8"),
                content_type="application/x-tex",
            )

            pdf_file = os.path.join(work_dir, "resume.pdf")

            compiled = False
            tried: list[str] = []
            last_error: str | None = None
            for compiler in ["xelatex", "tectonic", "pdflatex"]:
                if not shutil.which(compiler):
                    continue
                tried.append(compiler)
                try:
                    if compiler == "tectonic":
                        cmd = ["tectonic", latex_file, "-o", work_dir]
                    elif compiler == "xelatex":
                        cmd = [
                            "xelatex",
                            "-interaction=nonstopmode",
                            f"-output-directory={work_dir}",
                            latex_file,
                        ]
                    else:
                        cmd = [
                            "pdflatex",
                            "-interaction=nonstopmode",
                            f"-output-directory={work_dir}",
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

                    last_error = (
                        f"{compiler} exit={result.returncode}; "
                        f"stderr: {result.stderr[-800:] or '<empty>'}; "
                        f"stdout: {result.stdout[-400:] or '<empty>'}"
                    )
                    logger.warning(last_error)
                except subprocess.TimeoutExpired:
                    last_error = f"{compiler} timed out after {settings.latex_compile_timeout}s"
                    logger.warning(last_error)
                except Exception as e:
                    last_error = f"{compiler} failed: {e}"
                    logger.warning(last_error)

            if not compiled:
                if not tried:
                    msg = (
                        "No LaTeX compiler found on PATH (tried xelatex, tectonic, "
                        "pdflatex). Install one in the backend image."
                    )
                else:
                    msg = (
                        f"LaTeX compilation failed (tried: {', '.join(tried)}). "
                        f"Last error: {last_error}"
                    )
                return {
                    "success": False,
                    "message": msg,
                    "latex_available": True,
                    "download_url": f"/api/download/latex/{request.resume_id}",
                }

            with open(pdf_file, "rb") as f:
                pdf_bytes = f.read()
            resume_artifacts.upload_artifact(
                user.id,
                request.resume_id,
                "resume.pdf",
                pdf_bytes,
                content_type="application/pdf",
            )

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
async def download_pdf(
    resume_id: str, user: User = Depends(get_current_user)
):
    """Download compiled PDF"""
    # Ownership check
    resume_storage.load_resume_or_404(user.id, resume_id)

    pdf_bytes = resume_artifacts.download_artifact(user.id, resume_id, "resume.pdf")
    if pdf_bytes is None:
        raise HTTPException(status_code=404, detail="PDF not found. Please compile first.")

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'inline; filename="resume.pdf"'},
    )


@router.get("/download/latex/{resume_id}")
async def download_latex(
    resume_id: str, user: User = Depends(get_current_user)
):
    """Download LaTeX source"""
    resume_storage.load_resume_or_404(user.id, resume_id)

    tex_bytes = resume_artifacts.download_artifact(user.id, resume_id, "resume.tex")
    if tex_bytes is None:
        raise HTTPException(
            status_code=404, detail="LaTeX source not found. Please compile first."
        )

    return Response(
        content=tex_bytes,
        media_type="application/x-tex",
        headers={"Content-Disposition": 'attachment; filename="resume.tex"'},
    )
