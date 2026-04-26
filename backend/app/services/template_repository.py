"""Template repository backed by Supabase Postgres + Storage.

- Metadata lives in `public.templates` and `public.template_versions`.
- Source/preview/thumbnail files live in the `templates` Storage bucket at
  `templates/{id}/v{version}/(template.tex|preview.pdf|thumbnail.png)`.

The TeX source is cached in-process keyed by (template_id, checksum) so the
hot compile path does not re-download on every request. Metadata is cached
with a short TTL and refreshed by `invalidate()` after writes.
"""
from __future__ import annotations

import hashlib
import logging
import time
from dataclasses import dataclass
from threading import Lock
from typing import Optional

from fastapi import HTTPException

from app.services.supabase_client import get_supabase

logger = logging.getLogger(__name__)

BUCKET = "templates"
_META_TTL_SECONDS = 60
_TEX_CACHE_MAX = 32


@dataclass(frozen=True)
class TemplateMeta:
    id: str
    name: str
    description: str
    category: Optional[str]
    tags: list[str]
    author: Optional[str]
    latest_version: int
    is_active: bool
    is_featured: bool
    is_premium: bool
    display_order: int
    checksum: str
    tex_path: str
    preview_path: str
    thumbnail_path: str

    def public_dict(self) -> dict:
        """Shape returned by /api/templates — frontend-safe (no storage paths)."""
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "tags": self.tags,
            "author": self.author,
            "is_featured": self.is_featured,
            "is_premium": self.is_premium,
            "display_order": self.display_order,
        }


class TemplateRepository:
    def __init__(self) -> None:
        self._meta_cache: dict[str, TemplateMeta] = {}
        self._meta_cache_expires_at: float = 0.0
        self._tex_cache: dict[tuple[str, str], str] = {}
        self._lock = Lock()

    # ---------- reads ----------

    def list_active(self) -> list[TemplateMeta]:
        self._refresh_meta_if_stale()
        return sorted(
            (m for m in self._meta_cache.values() if m.is_active),
            key=lambda m: (m.display_order, m.name.lower()),
        )

    def get_meta(self, template_id: str) -> TemplateMeta:
        self._refresh_meta_if_stale()
        meta = self._meta_cache.get(template_id)
        if not meta or not meta.is_active:
            raise HTTPException(status_code=404, detail="Template not found")
        return meta

    def get_tex(self, template_id: str) -> str:
        meta = self.get_meta(template_id)
        key = (template_id, meta.checksum)
        cached = self._tex_cache.get(key)
        if cached is not None:
            return cached

        client = get_supabase()
        try:
            raw: bytes = client.storage.from_(BUCKET).download(meta.tex_path)
        except Exception as exc:
            logger.error("Failed to download tex for %s: %s", template_id, exc)
            raise HTTPException(
                status_code=502,
                detail=f"Template source unavailable: {template_id}",
            ) from exc

        text = raw.decode("utf-8")
        with self._lock:
            if len(self._tex_cache) >= _TEX_CACHE_MAX:
                self._tex_cache.pop(next(iter(self._tex_cache)))
            self._tex_cache[key] = text
        return text

    def get_preview_url(self, template_id: str) -> str:
        meta = self.get_meta(template_id)
        return self._public_url(meta.preview_path)

    def get_thumbnail_url(self, template_id: str) -> str:
        meta = self.get_meta(template_id)
        return self._public_url(meta.thumbnail_path)

    # ---------- writes (admin) ----------

    def upsert_template(
        self,
        *,
        template_id: str,
        name: str,
        description: str,
        category: Optional[str],
        tags: list[str],
        author: Optional[str],
        is_featured: bool,
        is_premium: bool,
        display_order: int,
        tex_bytes: bytes,
        preview_pdf_bytes: bytes,
        thumbnail_png_bytes: bytes,
        changelog: Optional[str] = None,
    ) -> int:
        """Upload files and insert rows. Returns the new version number."""
        client = get_supabase()
        checksum = hashlib.sha256(tex_bytes).hexdigest()

        next_version = self._next_version(template_id)
        prefix = f"{template_id}/v{next_version}"
        tex_path = f"{prefix}/template.tex"
        preview_path = f"{prefix}/preview.pdf"
        thumbnail_path = f"{prefix}/thumbnail.png"

        storage = client.storage.from_(BUCKET)
        storage.upload(
            tex_path,
            tex_bytes,
            {"content-type": "application/x-tex", "upsert": "true"},
        )
        storage.upload(
            preview_path,
            preview_pdf_bytes,
            {"content-type": "application/pdf", "upsert": "true"},
        )
        storage.upload(
            thumbnail_path,
            thumbnail_png_bytes,
            {"content-type": "image/png", "upsert": "true"},
        )

        # Parent row must exist before inserting into template_versions (FK).
        client.table("templates").upsert(
            {
                "id": template_id,
                "name": name,
                "description": description,
                "category": category,
                "tags": tags,
                "author": author,
                "latest_version": next_version,
                "is_active": True,
                "is_featured": is_featured,
                "is_premium": is_premium,
                "display_order": display_order,
            },
            on_conflict="id",
        ).execute()

        client.table("template_versions").upsert(
            {
                "template_id": template_id,
                "version": next_version,
                "tex_path": tex_path,
                "preview_path": preview_path,
                "thumbnail_path": thumbnail_path,
                "checksum": checksum,
                "changelog": changelog,
            },
            on_conflict="template_id,version",
        ).execute()

        self.invalidate()
        return next_version

    def set_active(self, template_id: str, active: bool) -> None:
        client = get_supabase()
        client.table("templates").update({"is_active": active}).eq(
            "id", template_id
        ).execute()
        self.invalidate()

    def invalidate(self) -> None:
        with self._lock:
            self._meta_cache = {}
            self._meta_cache_expires_at = 0.0
            self._tex_cache = {}

    # ---------- internals ----------

    def _refresh_meta_if_stale(self) -> None:
        if self._meta_cache_expires_at > time.time() and self._meta_cache:
            return
        with self._lock:
            if self._meta_cache_expires_at > time.time() and self._meta_cache:
                return
            self._meta_cache = self._load_meta()
            self._meta_cache_expires_at = time.time() + _META_TTL_SECONDS

    def _load_meta(self) -> dict[str, TemplateMeta]:
        client = get_supabase()
        tpls = (
            client.table("templates")
            .select("*")
            .eq("is_active", True)
            .execute()
            .data
            or []
        )
        if not tpls:
            return {}
        ids = [t["id"] for t in tpls]
        versions = (
            client.table("template_versions")
            .select("*")
            .in_("template_id", ids)
            .execute()
            .data
            or []
        )
        v_by_key = {(v["template_id"], v["version"]): v for v in versions}

        out: dict[str, TemplateMeta] = {}
        for t in tpls:
            v = v_by_key.get((t["id"], t["latest_version"]))
            if not v:
                logger.warning(
                    "Template %s has latest_version=%s but no matching row in "
                    "template_versions; skipping.",
                    t["id"],
                    t["latest_version"],
                )
                continue
            out[t["id"]] = TemplateMeta(
                id=t["id"],
                name=t["name"],
                description=t["description"],
                category=t.get("category"),
                tags=t.get("tags") or [],
                author=t.get("author"),
                latest_version=t["latest_version"],
                is_active=t["is_active"],
                is_featured=t.get("is_featured", False),
                is_premium=t.get("is_premium", False),
                display_order=t.get("display_order", 100),
                checksum=v["checksum"],
                tex_path=v["tex_path"],
                preview_path=v["preview_path"],
                thumbnail_path=v["thumbnail_path"],
            )
        return out

    def _next_version(self, template_id: str) -> int:
        client = get_supabase()
        rows = (
            client.table("template_versions")
            .select("version")
            .eq("template_id", template_id)
            .order("version", desc=True)
            .limit(1)
            .execute()
            .data
            or []
        )
        return (rows[0]["version"] + 1) if rows else 1

    def _public_url(self, path: str) -> str:
        client = get_supabase()
        return client.storage.from_(BUCKET).get_public_url(path)


_repo: Optional[TemplateRepository] = None


def get_template_repository() -> TemplateRepository:
    global _repo
    if _repo is None:
        _repo = TemplateRepository()
    return _repo
