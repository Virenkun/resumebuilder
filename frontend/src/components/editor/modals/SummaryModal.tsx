import { Textarea } from "@/components/ui/textarea";
import { SectionModal } from "../ui/SectionModal";

export function SummaryModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhance,
  enhancing,
}: {
  draft: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhance: () => void;
  enhancing: boolean;
}) {
  return (
    <SectionModal
      title="Edit summary"
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhance}
      enhancing={enhancing}
    >
      <Textarea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        placeholder="Write a brief professional summary (2–3 sentences)…"
        className="min-h-32"
      />
      <p className="text-xs text-muted-foreground">
        Use AI Enhance to improve clarity, impact, and professionalism.
      </p>
    </SectionModal>
  );
}
