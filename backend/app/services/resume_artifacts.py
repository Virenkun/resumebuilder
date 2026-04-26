"""Storage-backed artifact helpers for resumes.

Binary artifacts (resume.pdf, resume.tex, original.txt, tailored.json, etc.)
live in the Supabase Storage bucket `resume-artifacts` with the layout:

    {user_id}/{resume_id}/{filename}

Uses the service role client from app.services.supabase_client, so writes and
deletes bypass RLS. Read-access for end users is governed by the bucket's
`resume_artifacts_select_own` policy.
"""
from __future__ import annotations

from typing import Optional

from fastapi import HTTPException

from app.services.supabase_client import get_supabase

BUCKET = "resume-artifacts"


def _path(user_id: str, resume_id: str, filename: str) -> str:
    return f"{user_id}/{resume_id}/{filename}"


def upload_artifact(
    user_id: str,
    resume_id: str,
    filename: str,
    content: bytes,
    content_type: str = "application/octet-stream",
) -> str:
    """Upload (or overwrite) a single artifact. Returns the object path."""
    path = _path(user_id, resume_id, filename)
    sb = get_supabase()
    sb.storage.from_(BUCKET).upload(
        path=path,
        file=content,
        file_options={"content-type": content_type, "upsert": "true"},
    )
    return path


def download_artifact(user_id: str, resume_id: str, filename: str) -> Optional[bytes]:
    """Download a single artifact. Returns bytes or None if the object is missing."""
    path = _path(user_id, resume_id, filename)
    sb = get_supabase()
    try:
        return sb.storage.from_(BUCKET).download(path)
    except Exception:
        return None


def signed_url(
    user_id: str, resume_id: str, filename: str, ttl_seconds: int = 300
) -> str:
    """Return a short-lived signed URL for direct client download."""
    path = _path(user_id, resume_id, filename)
    sb = get_supabase()
    res = sb.storage.from_(BUCKET).create_signed_url(path, ttl_seconds)
    url = res.get("signedURL") or res.get("signed_url")
    if not url:
        raise HTTPException(status_code=500, detail="Failed to create signed URL")
    return url


def delete_prefix(user_id: str, resume_id: str) -> None:
    """Delete every artifact under `{user_id}/{resume_id}/`."""
    sb = get_supabase()
    folder = f"{user_id}/{resume_id}"
    try:
        items = sb.storage.from_(BUCKET).list(folder)
    except Exception:
        return
    if not items:
        return
    paths = [f"{folder}/{item['name']}" for item in items if item.get("name")]
    if paths:
        sb.storage.from_(BUCKET).remove(paths)
