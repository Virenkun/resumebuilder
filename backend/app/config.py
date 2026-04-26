from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache

BACKEND_ENV = Path(__file__).resolve().parents[1] / ".env"


class Settings(BaseSettings):
    # OpenAI API
    openai_api_key: str

    # Server Configuration
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5173"

    # Storage
    resume_artifact_bucket: str = "resume-artifacts"

    # File Upload
    max_file_size_mb: int = 10
    allowed_upload_types: str = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    # LaTeX
    latex_compile_timeout: int = 120
    latex_docker_image: str = "resumebuilder-latex-compiler"

    # OpenAI settings
    openai_model: str = "gpt-4o"
    openai_max_tokens: int = 4096
    openai_temperature: float = 0.7

    class Config:
        env_file = str(BACKEND_ENV)
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
