from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from app.config import get_settings
from app.routers import resume, upload, enhance, compile, score
from app.services.template_repository import get_template_repository

settings = get_settings()

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


@app.get("/api/templates")
async def list_templates():
    """List all active templates (metadata only) from Supabase."""
    repo = get_template_repository()
    return {"templates": [m.public_dict() for m in repo.list_active()]}


@app.get("/api/templates/{template_id}/preview")
async def get_template_preview(template_id: str):
    """Redirect to the CDN-served preview PDF in Supabase Storage."""
    repo = get_template_repository()
    return RedirectResponse(url=repo.get_preview_url(template_id), status_code=302)


@app.get("/api/templates/{template_id}/thumbnail")
async def get_template_thumbnail(template_id: str):
    """Redirect to the CDN-served PNG thumbnail in Supabase Storage."""
    repo = get_template_repository()
    return RedirectResponse(url=repo.get_thumbnail_url(template_id), status_code=302)


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
