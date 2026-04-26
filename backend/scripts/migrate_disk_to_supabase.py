"""One-shot migration: copy disk-based resume storage into Supabase.

Walks `STORAGE_PATH` (default: ./storage) which has the legacy layout:
    {storage_path}/{user_id}/{resume_id}/
        data.json                 -> public.resumes
        original.txt              -> resume-artifacts/{user_id}/{resume_id}/
        resume.tex                -> resume-artifacts/{user_id}/{resume_id}/
        resume.pdf                -> resume-artifacts/{user_id}/{resume_id}/
        tailored.json             -> resume-artifacts/{user_id}/{resume_id}/
        tailored_rationale.json   -> resume-artifacts/{user_id}/{resume_id}/

Idempotent: upserts rows by primary key and overwrites bucket objects.

Usage:
    cd backend
    STORAGE_PATH=./storage python -m scripts.migrate_disk_to_supabase
"""
from __future__ import annotations

import json
import mimetypes
import os
import sys
from pathlib import Path

from app.services import resume_artifacts, resume_storage  # noqa: F401 (warms caches)
from app.services.supabase_client import get_supabase

ARTIFACTS = [
    ("original.txt", "text/plain; charset=utf-8"),
    ("resume.tex", "application/x-tex"),
    ("resume.pdf", "application/pdf"),
    ("tailored.json", "application/json"),
    ("tailored_rationale.json", "application/json"),
]


def _is_uuid_like(s: str) -> bool:
    # UUIDs are 36 chars including 4 dashes.
    return len(s) == 36 and s.count("-") == 4


def main() -> int:
    storage_path = os.environ.get("STORAGE_PATH", "./storage")
    root = Path(storage_path).resolve()
    if not root.is_dir():
        print(f"Storage path not found: {root}")
        return 0

    sb = get_supabase()

    total_users = 0
    total_resumes = 0
    total_artifacts = 0
    failures = 0

    for user_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        user_id = user_dir.name
        if not _is_uuid_like(user_id):
            print(f"  skip non-user dir: {user_dir.name}")
            continue

        total_users += 1

        for resume_dir in sorted(p for p in user_dir.iterdir() if p.is_dir()):
            resume_id = resume_dir.name
            data_file = resume_dir / "data.json"
            if not data_file.exists():
                continue

            try:
                with data_file.open() as f:
                    data = json.load(f)
            except (OSError, json.JSONDecodeError) as e:
                print(f"  !! failed to read {data_file}: {e}")
                failures += 1
                continue

            # Force the payload to agree with its directory location.
            data["id"] = resume_id
            data["user_id"] = user_id

            try:
                resume_storage.save_resume(user_id, resume_id, data)
                total_resumes += 1
                print(f"  ok row  {user_id[:8]}../{resume_id[:8]}..")
            except Exception as e:
                print(f"  !! upsert failed for {resume_id}: {e}")
                failures += 1
                continue

            for filename, content_type in ARTIFACTS:
                path = resume_dir / filename
                if not path.exists():
                    continue
                try:
                    resume_artifacts.upload_artifact(
                        user_id,
                        resume_id,
                        filename,
                        path.read_bytes(),
                        content_type=content_type
                        or mimetypes.guess_type(filename)[0]
                        or "application/octet-stream",
                    )
                    total_artifacts += 1
                except Exception as e:
                    print(f"  !! artifact upload failed ({filename}): {e}")
                    failures += 1

    print(
        f"\nDone. users={total_users} resumes={total_resumes} "
        f"artifacts={total_artifacts} failures={failures}"
    )
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
