"""Supabase auth dependency for FastAPI.

Verifies the bearer access_token by calling Supabase's ``/auth/v1/user``
endpoint. Works for both legacy (HS256 JWT) and new (asymmetric) key systems,
at the cost of one HTTP call per request (cached briefly via in-memory LRU).
"""
from __future__ import annotations

import logging
import time
from functools import lru_cache
from typing import Optional

import httpx
from fastapi import Depends, Header, HTTPException, status
from pydantic_settings import BaseSettings

from app.config import BACKEND_ENV
from app.models.user import User

logger = logging.getLogger(__name__)


class AuthSettings(BaseSettings):
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_publishable_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    supabase_jwt_secret: Optional[str] = None  # legacy, unused with /auth/v1/user
    auth_disabled: bool = False

    class Config:
        env_file = str(BACKEND_ENV)
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_auth_settings() -> AuthSettings:
    return AuthSettings()


# Small in-memory token cache: {token: (expires_at_epoch, User)}.
# Avoids calling Supabase on every request. Entries expire after 60s.
_TOKEN_CACHE: dict[str, tuple[float, User]] = {}
_CACHE_TTL_SECONDS = 60


def _cache_get(token: str) -> Optional[User]:
    entry = _TOKEN_CACHE.get(token)
    if not entry:
        return None
    expires_at, user = entry
    if expires_at < time.time():
        _TOKEN_CACHE.pop(token, None)
        return None
    return user


def _cache_set(token: str, user: User) -> None:
    _TOKEN_CACHE[token] = (time.time() + _CACHE_TTL_SECONDS, user)


async def _verify_with_supabase(token: str, settings: AuthSettings) -> User:
    if not settings.supabase_url:
        raise HTTPException(
            status_code=500,
            detail="Server is missing SUPABASE_URL. Set it in the root .env.",
        )

    api_key = (
        settings.supabase_publishable_key
        or settings.supabase_anon_key
    )
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Server is missing SUPABASE_ANON_KEY (or SUPABASE_PUBLISHABLE_KEY). "
                "Set it in the root .env — Supabase Dashboard → Settings → API."
            ),
        )

    url = f"{settings.supabase_url.rstrip('/')}/auth/v1/user"
    headers = {
        "Authorization": f"Bearer {token}",
        "apikey": api_key,
    }

    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(url, headers=headers)
    except httpx.HTTPError as exc:
        logger.error(f"Supabase auth call failed: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Auth provider unreachable",
        )

    if resp.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token"
        )
    if resp.status_code != 200:
        logger.error(f"Supabase /auth/v1/user returned {resp.status_code}: {resp.text}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Token verification failed"
        )

    data = resp.json()
    user_id = data.get("id")
    email = data.get("email")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User id missing"
        )
    return User(id=user_id, email=email)


async def get_current_user(
    authorization: Optional[str] = Header(default=None),
) -> User:
    settings = get_auth_settings()

    if settings.auth_disabled:
        return User(id="local-dev-user", email="dev@local")

    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header",
        )

    token = authorization.split(" ", 1)[1].strip()

    cached = _cache_get(token)
    if cached is not None:
        return cached

    user = await _verify_with_supabase(token, settings)
    _cache_set(token, user)
    return user


CurrentUser = Depends(get_current_user)
