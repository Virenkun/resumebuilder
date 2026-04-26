import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  FilePlus2,
  FileText,
  Trash2,
  Clock,
  Sparkles,
} from "lucide-react";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";

interface ResumeListItem {
  id: string;
  name: string;
  template: string;
  last_modified?: string | null;
  ats_score?: number | null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ResumeListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await apiClient.get<{ resumes: ResumeListItem[] }>(
        "/api/resumes",
      );
      setItems(res.data.resumes ?? []);
    } catch (e) {
      console.error(e);
      setError("Failed to load resumes.");
      setItems([]);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resume? This cannot be undone.")) return;
    try {
      await apiClient.delete(`/api/resume/${id}`);
      await load();
    } catch (e) {
      console.error(e);
      alert("Delete failed.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <FadeInUp className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-5xl text-foreground">My resumes</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            All your resumes in one place. Edit, tailor, or score any of them.
          </p>
        </div>
        <Button asChild>
          <Link to="/create">
            <FilePlus2 className="size-4" /> New resume
          </Link>
        </Button>
      </FadeInUp>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs font-semibold text-destructive">
          {error}
        </div>
      )}

      {items === null ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2 animate-pulse rounded-full bg-primary" />
          Loading…
        </div>
      ) : items.length === 0 ? (
        <Navigate to="/onboarding" replace />
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <StaggerItem key={r.id}>
              <ResumeCard
                item={r}
                onOpen={() => navigate(`/editor/${r.id}`)}
                onDelete={() => handleDelete(r.id)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function ResumeCard({
  item,
  onOpen,
  onDelete,
}: {
  item: ResumeListItem;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="shadow-ring group relative flex h-full flex-col rounded-[24px] bg-card p-6 transition-transform hover:-translate-y-1">
      <button
        type="button"
        onClick={onDelete}
        title="Delete"
        className="absolute right-3 top-3 rounded-full bg-muted p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="size-3.5" />
      </button>

      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-secondary text-[#054d28]">
        <FileText className="size-5" />
      </div>

      <h3 className="truncate text-base font-semibold text-foreground">
        {item.name || "Untitled resume"}
      </h3>
      <div className="mt-2 mb-5 flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="capitalize">{item.template || "jakes_resume"}</span>
        {item.last_modified && (
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {new Date(item.last_modified).toLocaleDateString()}
          </span>
        )}
        {typeof item.ats_score === "number" && (
          <span className="inline-flex items-center gap-1 font-bold text-[#054d28]">
            <Sparkles className="size-3" /> {item.ats_score}
          </span>
        )}
      </div>

      <Button onClick={onOpen} className="mt-auto w-full" size="sm">
        Open editor
      </Button>
    </div>
  );
}
