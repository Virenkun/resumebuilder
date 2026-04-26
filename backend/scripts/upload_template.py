"""Upload or update a LaTeX template in Supabase.

Usage:
    python -m scripts.upload_template ./backend/templates/jakes_resume \
        --name "Jake's Resume" \
        --description "Clean single-column, ATS-optimized." \
        --category classic \
        --tags ats,single-column \
        --display-order 10

    python -m scripts.upload_template --deactivate jakes_resume
    python -m scripts.upload_template --activate jakes_resume

Each upload:
    1. Validates the folder has `template.tex` and `preview.tex`.
    2. Compiles `preview.tex` with Tectonic → `preview.pdf`.
    3. Smoke-renders `template.tex` against a sample resume fixture.
    4. Renders page 1 of the preview PDF to a PNG thumbnail (pdf2image).
    5. Uploads all three files to Supabase Storage at
       `templates/{id}/v{version}/...`.
    6. Upserts the metadata row and bumps `latest_version`.

Requires the backend `.env` with `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`,
and `tectonic` + `poppler` on PATH (both installed in the backend Dockerfile).
"""
from __future__ import annotations

import argparse
import io
import os
import subprocess
import sys
import tempfile
from pathlib import Path

# Ensure `app` package is importable when run via `python -m scripts.upload_template`
BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))

from app.routers.compile import prepare_template_data, render_latex  # noqa: E402
from app.services.template_repository import get_template_repository  # noqa: E402


SAMPLE_RESUME: dict = {
    "personal": {
        "name": "Sample Person",
        "email": "sample@example.com",
        "phone": "(555) 000-0000",
        "location": "Remote",
        "linkedin": "linkedin.com/in/sample",
        "github": "github.com/sample",
        "website": "",
    },
    "summary": "Software engineer used to smoke-test template compilation.",
    "experience": [
        {
            "company": "Acme Corp",
            "position": "Senior Engineer",
            "location": "Remote",
            "start_date": "2023-01",
            "end_date": "Present",
            "bullets": ["Shipped features", "Led migrations"],
        }
    ],
    "education": [
        {
            "institution": "State University",
            "degree": "BS",
            "field": "Computer Science",
            "location": "City, ST",
            "graduation_date": "2020-05",
            "gpa": "3.8",
        }
    ],
    "skills": {
        "technical": ["Python", "TypeScript"],
        "frameworks": ["FastAPI", "React"],
        "tools": ["Git", "Docker"],
        "languages": ["English"],
    },
    "projects": [],
    "certifications": [],
}


def compile_preview(preview_tex: Path, workdir: Path) -> bytes:
    """Compile preview.tex with Tectonic and return preview.pdf bytes."""
    staged = workdir / "preview.tex"
    staged.write_bytes(preview_tex.read_bytes())
    try:
        subprocess.run(
            ["tectonic", str(staged), "-o", str(workdir)],
            check=True,
            capture_output=True,
            timeout=120,
        )
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"Tectonic failed compiling preview.tex:\n"
            f"stdout: {exc.stdout.decode(errors='ignore')[-800:]}\n"
            f"stderr: {exc.stderr.decode(errors='ignore')[-800:]}"
        ) from exc
    pdf = workdir / "preview.pdf"
    if not pdf.exists():
        raise RuntimeError("Tectonic succeeded but preview.pdf not found")
    return pdf.read_bytes()


def smoke_test_template(template_tex: Path, workdir: Path) -> None:
    """Ensure template.tex renders and compiles with a canned resume."""
    text = template_tex.read_text(encoding="utf-8")
    rendered = _render_for_smoke(text)
    tmp = workdir / "smoke.tex"
    tmp.write_text(rendered, encoding="utf-8")
    try:
        subprocess.run(
            ["tectonic", str(tmp), "-o", str(workdir)],
            check=True,
            capture_output=True,
            timeout=120,
        )
    except subprocess.CalledProcessError as exc:
        raise RuntimeError(
            f"Smoke compile failed for template.tex:\n"
            f"stdout: {exc.stdout.decode(errors='ignore')[-800:]}\n"
            f"stderr: {exc.stderr.decode(errors='ignore')[-800:]}"
        ) from exc


def _render_for_smoke(tex_source: str) -> str:
    from jinja2 import Environment, BaseLoader

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
    data = prepare_template_data(SAMPLE_RESUME)
    return env.from_string(tex_source).render(**data)


def render_thumbnail(preview_pdf_bytes: bytes) -> bytes:
    """Render page 1 of a PDF to a PNG (150 DPI, ~1275x1650 for US letter)."""
    try:
        from pdf2image import convert_from_bytes
    except ImportError as exc:
        raise RuntimeError(
            "pdf2image is not installed. Add it to backend/requirements.txt."
        ) from exc

    images = convert_from_bytes(
        preview_pdf_bytes, dpi=150, first_page=1, last_page=1, fmt="png"
    )
    if not images:
        raise RuntimeError("Failed to render thumbnail — pdf2image returned 0 pages")
    buf = io.BytesIO()
    images[0].save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def run_upload(args: argparse.Namespace) -> None:
    folder = Path(args.folder).resolve()
    template_tex = folder / "template.tex"
    preview_tex = folder / "preview.tex"

    if not template_tex.exists():
        raise SystemExit(f"Missing {template_tex}")
    if not preview_tex.exists():
        raise SystemExit(f"Missing {preview_tex}")

    template_id = args.id or folder.name
    tags = [t.strip() for t in (args.tags or "").split(",") if t.strip()]

    with tempfile.TemporaryDirectory() as tmp:
        workdir = Path(tmp)
        print(f"[1/5] Smoke-testing template.tex with sample data…")
        smoke_test_template(template_tex, workdir)

        print(f"[2/5] Compiling preview.tex → preview.pdf…")
        preview_pdf_bytes = compile_preview(preview_tex, workdir)

        print(f"[3/5] Rendering thumbnail.png from preview.pdf…")
        thumbnail_png_bytes = render_thumbnail(preview_pdf_bytes)

        print(f"[4/5] Uploading to Supabase Storage + upserting metadata…")
        repo = get_template_repository()
        version = repo.upsert_template(
            template_id=template_id,
            name=args.name,
            description=args.description,
            category=args.category,
            tags=tags,
            author=args.author,
            is_featured=args.featured,
            is_premium=args.premium,
            display_order=args.display_order,
            tex_bytes=template_tex.read_bytes(),
            preview_pdf_bytes=preview_pdf_bytes,
            thumbnail_png_bytes=thumbnail_png_bytes,
            changelog=args.changelog,
        )

        print(f"[5/5] Done. Uploaded {template_id} as v{version}.")


def run_toggle(template_id: str, active: bool) -> None:
    repo = get_template_repository()
    repo.set_active(template_id, active)
    state = "activated" if active else "deactivated"
    print(f"{template_id} {state}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload/update a template in Supabase.")
    parser.add_argument("folder", nargs="?", help="Path to template folder (contains template.tex + preview.tex)")
    parser.add_argument("--id", help="Template id (slug). Defaults to folder name.")
    parser.add_argument("--name", help="Display name")
    parser.add_argument("--description", help="Short description")
    parser.add_argument("--category", default=None, help="e.g. classic, modern, academic")
    parser.add_argument("--tags", default="", help="Comma-separated tags")
    parser.add_argument("--author", default=None)
    parser.add_argument("--featured", action="store_true")
    parser.add_argument("--premium", action="store_true")
    parser.add_argument("--display-order", type=int, default=100)
    parser.add_argument("--changelog", default=None)
    parser.add_argument("--deactivate", metavar="TEMPLATE_ID", help="Mark template inactive")
    parser.add_argument("--activate", metavar="TEMPLATE_ID", help="Mark template active")

    args = parser.parse_args()

    if args.deactivate:
        run_toggle(args.deactivate, active=False)
        return
    if args.activate:
        run_toggle(args.activate, active=True)
        return

    if not args.folder:
        parser.error("folder is required (or use --deactivate/--activate)")
    if not args.name or not args.description:
        parser.error("--name and --description are required for upload")

    run_upload(args)


if __name__ == "__main__":
    main()
