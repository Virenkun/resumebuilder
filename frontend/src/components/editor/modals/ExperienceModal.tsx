import { Loader2, Plus, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionModal } from "../ui/SectionModal";

export function ExperienceModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhanceAll,
  enhancing,
  enhancingBulletIdx,
  enhancedBulletIdxs,
  bulletInstructions,
  onBulletInstructionChange,
  onEnhanceBullet,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhanceAll: () => void;
  enhancing: boolean;
  enhancingBulletIdx: number | null;
  enhancedBulletIdxs: Set<number>;
  bulletInstructions: Record<number, string>;
  onBulletInstructionChange: (idx: number, v: string) => void;
  onEnhanceBullet: (idx: number, instruction?: string) => void;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit experience" : "Add experience"}
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhanceAll}
      enhancing={enhancing}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Position"
            value={draft.position}
            onChange={(v) => onChange({ ...draft, position: v })}
          />
          <Field
            label="Company"
            value={draft.company}
            onChange={(v) => onChange({ ...draft, company: v })}
          />
          <Field
            label="Location"
            value={draft.location}
            onChange={(v) => onChange({ ...draft, location: v })}
          />
          <div className="grid grid-cols-2 gap-2">
            <Field
              label="Start"
              value={draft.start_date}
              placeholder="YYYY-MM"
              onChange={(v) => onChange({ ...draft, start_date: v })}
            />
            <Field
              label="End"
              value={draft.end_date}
              placeholder="YYYY-MM or Present"
              onChange={(v) => onChange({ ...draft, end_date: v })}
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Bullet points</Label>
          <div className="space-y-3">
            {draft.bullets.map((bullet: string, bIdx: number) => (
              <div key={bIdx} className="space-y-1.5">
                <div className="flex gap-2">
                  <Textarea
                    value={bullet}
                    onChange={(e) => {
                      const bullets = [...draft.bullets];
                      bullets[bIdx] = e.target.value;
                      onChange({ ...draft, bullets });
                    }}
                    rows={2}
                    placeholder="Describe an accomplishment…"
                    className="flex-1"
                  />
                  <div className="flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => onEnhanceBullet(bIdx)}
                      disabled={enhancingBulletIdx === bIdx}
                      title="AI enhance this bullet"
                      className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28] disabled:opacity-40"
                    >
                      {enhancingBulletIdx === bIdx ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const bullets = draft.bullets.filter(
                          (_: any, i: number) => i !== bIdx,
                        );
                        onChange({
                          ...draft,
                          bullets: bullets.length ? bullets : [""],
                        });
                      }}
                      title="Remove bullet"
                      className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
                {enhancedBulletIdxs.has(bIdx) && (
                  <div className="flex gap-2">
                    <Input
                      value={bulletInstructions[bIdx] || ""}
                      onChange={(e) =>
                        onBulletInstructionChange(bIdx, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          onEnhanceBullet(bIdx, bulletInstructions[bIdx]);
                      }}
                      placeholder="Instruction for re-enhancement (e.g. add metrics)…"
                      className="h-9 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onEnhanceBullet(bIdx, bulletInstructions[bIdx])
                      }
                      disabled={enhancingBulletIdx === bIdx}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-[#054d28] transition-colors hover:bg-accent disabled:opacity-40"
                    >
                      Re-enhance
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...draft,
                  bullets: [...draft.bullets, ""],
                })
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#054d28] hover:underline"
            >
              <Plus className="size-4" />
              Add bullet
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          AI Enhance will rewrite bullets with action verbs and quantified impact.
        </p>
      </div>
    </SectionModal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
