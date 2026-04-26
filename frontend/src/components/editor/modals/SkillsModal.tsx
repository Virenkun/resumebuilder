import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionModal } from "../ui/SectionModal";

export function SkillsModal({
  draft,
  onChange,
  onClose,
  onSave,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <SectionModal title="Edit skills" onClose={onClose} onSave={onSave}>
      <div className="space-y-4">
        {(["technical", "languages", "frameworks", "tools"] as const).map(
          (cat) => (
            <div key={cat} className="space-y-1.5">
              <Label className="capitalize">{cat}</Label>
              <Input
                value={draft[cat].join(", ")}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    [cat]: e.target.value
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean),
                  })
                }
                placeholder={`Enter ${cat} skills, comma-separated…`}
              />
            </div>
          ),
        )}
        <p className="text-xs text-muted-foreground">
          Separate each skill with a comma.
        </p>
      </div>
    </SectionModal>
  );
}
