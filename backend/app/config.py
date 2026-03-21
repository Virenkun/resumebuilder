from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # API Keys
    anthropic_api_key: str

    # Server Configuration
    backend_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:5173"

    # Storage
    storage_path: str = "./storage"

    # File Upload
    max_file_size_mb: int = 10
    allowed_upload_types: str = "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    # LaTeX
    latex_compile_timeout: int = 120
    latex_docker_image: str = "resumebuilder-latex-compiler"

    # Claude API
    claude_model: str = "claude-sonnet-4-6"
    claude_max_tokens: int = 4096
    claude_temperature: float = 0.7

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
