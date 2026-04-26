"""Supabase client singleton for backend-only, RLS-bypassing operations.

Uses the service role key. NEVER expose this client or key to the frontend.
"""
from __future__ import annotations

from functools import lru_cache

from fastapi import HTTPException
from supabase import Client, create_client

from app.deps.auth import get_auth_settings


@lru_cache(maxsize=1)
def get_supabase() -> Client:
    settings = get_auth_settings()

    if not settings.supabase_url:
        raise HTTPException(
            status_code=500,
            detail="Server is missing SUPABASE_URL.",
        )
    if not settings.supabase_service_role_key:
        raise HTTPException(
            status_code=500,
            detail=(
                "Server is missing SUPABASE_SERVICE_ROLE_KEY. "
                "Set it in the backend .env — Supabase Dashboard → Settings → API → "
                "service_role key. Backend only; never expose to the frontend."
            ),
        )

    return create_client(settings.supabase_url, settings.supabase_service_role_key)
