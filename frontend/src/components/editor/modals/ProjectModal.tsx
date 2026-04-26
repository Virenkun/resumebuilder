import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionModal } from "../ui/SectionModal";

export function ProjectModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhance,
  enhancing,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhance: () => void;
  enhancing: boolean;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit project" : "Add project"}
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhance}
      enhancing={enhancing}
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label>Project name</Label>
          <Input
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Description</Label>
          <Textarea
            value={draft.description}
            onChange={(e) => onChange({ ...draft, description: e.target.value })}
            rows={3}
            placeholder="Describe the project…"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Technologies</Label>
          <Input
            value={draft.technologies.join(", ")}
            onChange={(e) =>
              onChange({
                ...draft,
                technologies: e.target.value
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean),
              })
            }
            placeholder="React, Node.js, PostgreSQL…"
          />
        </div>
        <div className="space-y-1.5">
          <Label>Link (optional)</Label>
          <Input
            value={draft.link || ""}
            onChange={(e) => onChange({ ...draft, link: e.target.value })}
            placeholder="https://…"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          AI Enhance will improve your project description.
        </p>
      </div>
    </SectionModal>
  );
}
