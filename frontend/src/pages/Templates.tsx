import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutTemplate } from "lucide-react";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";

interface TemplateMeta {
  id: string;
  name: string;
  description: string;
}

interface ResumeListItem {
  id: string;
  name: string;
}

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<TemplateMeta[] | null>(null);
  const [resumes, setResumes] = useState<ResumeListItem[] | null>(null);
  const [resumeId, setResumeId] = useState<string>("");

  useEffect(() => {
    apiClient
      .get<{ templates: TemplateMeta[] }>("/api/templates")
      .then((res) => setTemplates(res.data.templates ?? []))
      .catch(() => setTemplates([]));

    apiClient
      .get<{ resumes: ResumeListItem[] }>("/api/resumes")
      .then((res) => {
        const list = res.data.resumes ?? [];
        setResumes(list);
        if (list.length > 0) setResumeId(list[0].id);
      })
      .catch(() => setResumes([]));
  }, []);

  const apply = async (templateId: string) => {
    if (!resumeId) {
      alert("Create or select a resume first.");
      return;
    }
    try {
      const { data } = await apiClient.get<{ resume: unknown }>(
        `/api/resume/${resumeId}`,
      );
      const resume = (data as { resume: Record<string, unknown> }).resume;
      const metadata = (resume.metadata as Record<string, unknown>) ?? {};
      const updated = {
        ...resume,
        metadata: { ...metadata, template: templateId },
      };
      await apiClient.put(`/api/resume/${resumeId}`, updated);
      navigate(`/editor/${resumeId}`);
    } catch {
      alert("Failed to apply template.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-8">
      <FadeInUp>
        <h1 className="font-display text-5xl text-foreground">Templates</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Browse every LaTeX template. Pick a resume and apply.
        </p>
      </FadeInUp>

      <div className="shadow-ring mb-6 flex items-center gap-3 rounded-2xl bg-card p-4">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Apply to
        </span>
        <Select value={resumeId} onValueChange={setResumeId}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select resume" />
          </SelectTrigger>
          <SelectContent>
            {resumes?.length === 0 && (
              <SelectItem value="none" disabled>
                No resumes yet
              </SelectItem>
            )}
            {resumes?.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.name || "Untitled"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {templates === null ? (
        <div className="text-sm text-muted-foreground">Loading templates…</div>
      ) : (
        <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <StaggerItem key={t.id}>
              <TemplateCard
                template={t}
                disabled={!resumeId}
                onApply={() => apply(t.id)}
              />
            </StaggerItem>
          ))}
        </Stagger>
      )}
    </div>
  );
}

function TemplateCard({
  template,
  disabled,
  onApply,
}: {
  template: TemplateMeta;
  disabled: boolean;
  onApply: () => void;
}) {
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const thumbnailUrl = `${apiBase}/api/templates/${template.id}/thumbnail`;

  return (
    <div className="shadow-ring flex h-full flex-col overflow-hidden rounded-3xl bg-card transition-transform hover:-translate-y-1">
      <div className="h-48 w-full overflow-hidden bg-muted">
        <img
          src={thumbnailUrl}
          alt={`${template.name} template preview`}
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-2">
          <LayoutTemplate className="size-4 text-[#054d28]" />
          <h3 className="text-base font-semibold text-foreground">
            {template.name}
          </h3>
        </div>
        <p className="mb-5 flex-1 text-sm text-muted-foreground">
          {template.description}
        </p>
        <Button
          onClick={onApply}
          disabled={disabled}
          size="sm"
          className="w-full"
        >
          Apply template
        </Button>
      </div>
    </div>
  );
}
