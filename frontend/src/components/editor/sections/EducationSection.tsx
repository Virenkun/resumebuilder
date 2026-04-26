import { Pencil, Plus, Trash2 } from "lucide-react";
import { HintTip } from "../ui/HintTip";

export function EducationSection({
  education,
  onEdit,
  onDelete,
  onAdd,
}: {
  education: any[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      {education.map((edu: any, idx: number) => (
        <div
          key={edu.id}
          className="group/item flex items-start justify-between"
        >
          <div className="text-sm text-foreground">
            <span className="font-semibold">
              {edu.degree} in {edu.field}
            </span>{" "}
            <span className="text-muted-foreground">
              · {edu.institution} · {edu.graduation_date}
            </span>
            {edu.gpa && (
              <span className="ml-2 text-muted-foreground">GPA {edu.gpa}</span>
            )}
          </div>
          <div className="flex gap-1">
            <HintTip label="Edit this education entry">
              <button
                onClick={() => onEdit(idx)}
                aria-label="Edit education"
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-[#054d28]"
              >
                <Pencil className="size-3.5" />
              </button>
            </HintTip>
            <HintTip label="Remove this education entry">
              <button
                onClick={() => onDelete(idx)}
                aria-label="Delete education"
                className="inline-flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </HintTip>
          </div>
        </div>
      ))}
      <HintTip label="Add another school or degree">
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#054d28] hover:underline"
        >
          <Plus className="size-4" />
          Add education
        </button>
      </HintTip>
    </div>
  );
}
