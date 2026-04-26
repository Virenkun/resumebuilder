import { Eye } from "lucide-react";
import { TemplateThumbnail } from "../templates/TemplateThumbnail";
import { cn } from "@/lib/utils";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export function TemplateSidebar({
  templates,
  selectedTemplate,
  onSelect,
  onTogglePreview,
}: {
  templates: TemplateInfo[];
  selectedTemplate: string;
  onSelect: (id: string) => void;
  previewTemplate: string | null;
  onTogglePreview: (id: string) => void;
}) {
  return (
    <div className="border rounded-3xl bg-card p-5">
      <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        Template
      </h3>
      <div className="space-y-3">
        {templates.map((tpl) => {
          const active = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={cn(
                "group block w-full overflow-hidden rounded-lg bg-card text-left transition-all",
                active
                  ? "ring-2 ring-primary"
                  : "shadow-ring hover:-translate-y-0.5",
              )}
            >
              <div className="relative bg-muted">
                <TemplateThumbnail templateId={tpl.id} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTogglePreview(tpl.id);
                  }}
                  className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-[10px] font-semibold text-foreground opacity-0 shadow-sm transition-opacity hover:bg-card group-hover:opacity-100"
                >
                  <Eye className="size-3" />
                  Preview
                </button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2">
                  {active && (
                    <span className="size-2 rounded-full bg-primary" />
                  )}
                  <p className="text-sm font-semibold text-foreground">
                    {tpl.name}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tpl.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
