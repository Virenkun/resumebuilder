import { Loader2, MessageSquareText, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { HintTip } from "../ui/HintTip";

export function ProjectsSection({
  projects,
  pendingEnhancements,
  enhancingViewBullet,
  viewPromptOpen,
  viewPromptText,
  onEdit,
  onDelete,
  onAdd,
  onEnhanceProj,
  onAcceptProj,
  onRejectProj,
  onToggleProjPrompt,
  onProjPromptChange,
}: {
  projects: any[];
  pendingEnhancements: Record<string, { original: string; enhanced: string }>;
  enhancingViewBullet: string | null;
  viewPromptOpen: string | null;
  viewPromptText: Record<string, string>;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onEnhanceProj: (idx: number, instruction?: string) => void;
  onAcceptProj: (idx: number) => void;
  onRejectProj: (idx: number) => void;
  onToggleProjPrompt: (key: string) => void;
  onProjPromptChange: (key: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      {projects.map((proj: any, idx: number) => (
        <div
          key={proj.id || idx}
          className="group/item border-l-2 border-primary/60 pl-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {proj.name}
              </h4>
              {proj.technologies?.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {proj.technologies.map((tech: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-1">
              <HintTip label="Edit this project">
                <button
                  onClick={() => onEdit(idx)}
                  aria-label="Edit project"
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28]"
                >
                  <Pencil className="size-3.5" />
                </button>
              </HintTip>
              <HintTip label="Remove this project">
                <button
                  onClick={() => onDelete(idx)}
                  aria-label="Delete project"
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </HintTip>
            </div>
          </div>
          {proj.description &&
            (() => {
              const key = `proj-${idx}`;
              const pending = pendingEnhancements[key];
              const isEnhancing = enhancingViewBullet === key;
              return pending ? (
                <div className="mt-2 space-y-1.5">
                  <p className="text-sm leading-relaxed text-destructive/70 line-through">
                    {pending.original}
                  </p>
                  <p className="text-sm font-medium leading-relaxed text-[#054d28]">
                    {pending.enhanced}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onAcceptProj(idx)}
                      className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-[#054d28] hover:bg-accent"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectProj(idx)}
                      className="rounded-full bg-destructive/10 px-3 py-0.5 text-xs font-bold text-destructive hover:bg-destructive/15"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-foreground">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <HintTip label="Rewrite this description with AI">
                      <button
                        onClick={() => onEnhanceProj(idx)}
                        disabled={isEnhancing}
                        aria-label="AI enhance project"
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-[#054d28] disabled:opacity-40"
                      >
                        {isEnhancing ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Sparkles className="size-3" />
                        )}
                        Enhance
                      </button>
                    </HintTip>
                    <HintTip label="Rewrite with a custom instruction">
                      <button
                        onClick={() => onToggleProjPrompt(key)}
                        aria-label="Enhance project with instruction"
                        className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-[#054d28]"
                      >
                        <MessageSquareText className="size-3" />
                        With prompt
                      </button>
                    </HintTip>
                  </div>
                  {viewPromptOpen === key && (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={viewPromptText[key] || ""}
                        onChange={(e) =>
                          onProjPromptChange(key, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            onEnhanceProj(idx, viewPromptText[key]);
                          if (e.key === "Escape") onToggleProjPrompt(key);
                        }}
                        placeholder="e.g. highlight impact, mention scale…"
                        className="flex-1 rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        onClick={() => onEnhanceProj(idx, viewPromptText[key])}
                        disabled={isEnhancing}
                        className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95] disabled:opacity-40"
                      >
                        Enhance
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs font-semibold text-[#054d28] hover:underline"
            >
              {proj.link}
            </a>
          )}
        </div>
      ))}
      <HintTip label="Add another project">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#054d28] hover:underline"
        >
          <Plus className="size-4" />
          Add project
        </button>
      </HintTip>
    </div>
  );
}
