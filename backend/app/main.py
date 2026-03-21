from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from app.config import get_settings
from app.routers import resume, upload, enhance, compile, score
import os

settings = get_settings()

# Create storage directory if it doesn't exist
os.makedirs(settings.storage_path, exist_ok=True)

app = FastAPI(
    title="AI Resume Builder API",
    description="Backend API for AI-powered resume building with Claude and LaTeX",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "AI Resume Builder API",
        "version": "1.0.0",
        "status": "running"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# Template preview endpoint
TEMPLATES_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")

TEMPLATES_META = [
    {"id": "jakes_resume", "name": "Jake's Resume", "description": "Clean single-column, ATS-optimized. The most popular LaTeX resume template."},
    {"id": "modern", "name": "Modern", "description": "Blue accent color, contemporary feel. Great for tech and creative roles."},
    {"id": "classic", "name": "Classic", "description": "Traditional serif font, academic style. Ideal for research and corporate roles."},
    {"id": "minimal", "name": "Minimal", "description": "Ultra-clean sans-serif with generous whitespace. Elegant and modern."},
    {"id": "deedy", "name": "Deedy", "description": "Two-column layout with sidebar for skills and education. Inspired by the popular Deedy CV template."},
]


@app.get("/api/templates")
async def list_templates():
    """List all available templates with metadata"""
    return {"templates": TEMPLATES_META}


@app.get("/api/templates/{template_id}/preview")
async def get_template_preview(template_id: str):
    """Get preview PDF for a template"""
    preview_path = os.path.join(TEMPLATES_DIR, template_id, "preview.pdf")
    if not os.path.exists(preview_path):
        raise HTTPException(status_code=404, detail="Preview not found")
    return FileResponse(preview_path, media_type="application/pdf")


# Include routers
app.include_router(resume.router, prefix="/api", tags=["resume"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(enhance.router, prefix="/api", tags=["enhance"])
app.include_router(compile.router, prefix="/api", tags=["compile"])
app.include_router(score.router, prefix="/api", tags=["score"])


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc)
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
