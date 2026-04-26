import { Loader2, MessageSquareText, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { HintTip } from "../ui/HintTip";

export function ExperienceSection({
  experience,
  pendingEnhancements,
  enhancingViewBullet,
  viewPromptOpen,
  viewPromptText,
  onEdit,
  onDelete,
  onAdd,
  onEnhanceBullet,
  onAcceptBullet,
  onRejectBullet,
  onToggleBulletPrompt,
  onBulletPromptChange,
}: {
  experience: any[];
  pendingEnhancements: Record<string, { original: string; enhanced: string }>;
  enhancingViewBullet: string | null;
  viewPromptOpen: string | null;
  viewPromptText: Record<string, string>;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onEnhanceBullet: (expIdx: number, bIdx: number, instruction?: string) => void;
  onAcceptBullet: (expIdx: number, bIdx: number) => void;
  onRejectBullet: (expIdx: number, bIdx: number) => void;
  onToggleBulletPrompt: (key: string) => void;
  onBulletPromptChange: (key: string, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      {experience.map((exp: any, idx: number) => (
        <div
          key={exp.id}
          className="group/item relative border-l-2 border-primary/60 pl-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                {exp.position}
              </h4>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""} · {exp.start_date} –{" "}
                {exp.end_date}
              </p>
            </div>
            <div className="flex gap-1">
              <HintTip label="Edit this role">
                <button
                  onClick={() => onEdit(idx)}
                  aria-label="Edit experience"
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28]"
                >
                  <Pencil className="size-3.5" />
                </button>
              </HintTip>
              <HintTip label="Remove this role">
                <button
                  onClick={() => onDelete(idx)}
                  aria-label="Delete experience"
                  className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </HintTip>
            </div>
          </div>
          {exp.bullets.length > 0 && (
            <ul className="mt-2 space-y-2">
              {exp.bullets.map((bullet: string, bIdx: number) => {
                const key = `${idx}-${bIdx}`;
                const pending = pendingEnhancements[key];
                const isEnhancing = enhancingViewBullet === key;
                return (
                  <li key={bIdx} className="group/bullet text-sm">
                    {pending ? (
                      <div className="space-y-1">
                        <div className="relative pl-4">
                          <span className="absolute left-0 text-destructive/70">−</span>
                          <span className="text-destructive/70 line-through">
                            {pending.original}
                          </span>
                        </div>
                        <div className="relative pl-4">
                          <span className="absolute left-0 text-[#054d28]">+</span>
                          <span className="font-medium text-[#054d28]">
                            {pending.enhanced}
                          </span>
                        </div>
                        <div className="flex gap-2 pl-4 pt-1">
                          <button
                            onClick={() => onAcceptBullet(idx, bIdx)}
                            className="rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-[#054d28] hover:bg-accent"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onRejectBullet(idx, bIdx)}
                            className="rounded-full bg-destructive/10 px-3 py-0.5 text-xs font-bold text-destructive hover:bg-destructive/15"
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="relative flex items-start gap-1 pl-4">
                          <span className="absolute left-0 text-primary">•</span>
                          <span className="flex-1 text-foreground">{bullet}</span>
                          <div className="flex shrink-0 gap-0.5">
                            <HintTip label="Rewrite this bullet with AI">
                              <button
                                onClick={() => onEnhanceBullet(idx, bIdx)}
                                disabled={isEnhancing}
                                aria-label="AI enhance bullet"
                                className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28] disabled:opacity-40"
                              >
                                {isEnhancing ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <Sparkles className="size-3" />
                                )}
                              </button>
                            </HintTip>
                            <HintTip label="Rewrite with a custom instruction">
                              <button
                                onClick={() => onToggleBulletPrompt(key)}
                                aria-label="Enhance bullet with instruction"
                                className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28]"
                              >
                                <MessageSquareText className="size-3" />
                              </button>
                            </HintTip>
                          </div>
                        </div>
                        {viewPromptOpen === key && (
                          <div className="flex gap-2 pl-4">
                            <input
                              autoFocus
                              value={viewPromptText[key] || ""}
                              onChange={(e) =>
                                onBulletPromptChange(key, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  onEnhanceBullet(idx, bIdx, viewPromptText[key]);
                                if (e.key === "Escape")
                                  onToggleBulletPrompt(key);
                              }}
                              placeholder="e.g. add metrics, focus on leadership…"
                              className="flex-1 rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                            />
                            <button
                              onClick={() =>
                                onEnhanceBullet(idx, bIdx, viewPromptText[key])
                              }
                              disabled={isEnhancing}
                              className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95] disabled:opacity-40"
                            >
                              Enhance
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
      <HintTip label="Add another work experience entry">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#054d28] hover:underline"
        >
          <Plus className="size-4" />
          Add experience
        </button>
      </HintTip>
    </div>
  );
}
