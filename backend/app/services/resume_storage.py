"""Supabase-backed resume storage.

Resume payloads live in `public.resumes.data` (JSONB) with a few mirrored
columns for list queries. Binary artifacts are handled in `resume_artifacts`.

The public function surface matches the previous disk-based implementation so
the six callers (`resume`, `upload`, `enhance`, `compile`, `score`) do not need
to change their import paths.
"""
from __future__ import annotations

from typing import Iterator

from fastapi import HTTPException

from app.services import resume_artifacts
from app.services.supabase_client import get_supabase

TABLE = "resumes"


def _client():
    return get_supabase()


def _mirror_columns(data: dict) -> dict:
    """Extract first-class columns from the resume payload for list queries."""
    personal = data.get("personal") or {}
    metadata = data.get("metadata") or {}
    return {
        "name": personal.get("name") or None,
        "template": metadata.get("template") or "jakes_resume",
        "ats_score": metadata.get("ats_score"),
        "target_jd": metadata.get("target_jd"),
    }


def save_resume(user_id: str, resume_id: str, data: dict) -> None:
    """Insert or update a resume row."""
    data["user_id"] = user_id
    data["id"] = resume_id
    row = {
        "id": resume_id,
        "user_id": user_id,
        "data": data,
        **_mirror_columns(data),
    }
    _client().table(TABLE).upsert(row, on_conflict="id").execute()


def load_resume_or_404(user_id: str, resume_id: str) -> dict:
    """Load a resume and enforce ownership.

    Raises 404 if missing, 403 if owned by another user.
    """
    res = (
        _client()
        .table(TABLE)
        .select("user_id,data")
        .eq("id", resume_id)
        .limit(1)
        .execute()
    )
    rows = res.data or []
    if not rows:
        raise HTTPException(status_code=404, detail="Resume not found")
    row = rows[0]
    if row.get("user_id") and row["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return row.get("data") or {}


def delete_resume(user_id: str, resume_id: str) -> None:
    """Delete a resume row (ownership-checked) and its storage artifacts."""
    load_resume_or_404(user_id, resume_id)
    _client().table(TABLE).delete().eq("id", resume_id).eq(
        "user_id", user_id
    ).execute()
    try:
        resume_artifacts.delete_prefix(user_id, resume_id)
    except Exception:
        # Artifact cleanup is best-effort; never block delete.
        pass


def iter_user_resumes(user_id: str) -> Iterator[dict]:
    """Yield each resume payload owned by `user_id`, newest first."""
    res = (
        _client()
        .table(TABLE)
        .select("data")
        .eq("user_id", user_id)
        .order("last_modified", desc=True)
        .execute()
    )
    for row in res.data or []:
        data = row.get("data") or {}
        if data:
            yield data
