import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionModal } from "../ui/SectionModal";

export function EducationModal({
  draft,
  onChange,
  onClose,
  onSave,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit education" : "Add education"}
      onClose={onClose}
      onSave={onSave}
    >
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Institution"
          className="col-span-2"
          value={draft.institution}
          onChange={(v) => onChange({ ...draft, institution: v })}
        />
        <Field
          label="Degree"
          value={draft.degree}
          placeholder="e.g. Bachelor of Science"
          onChange={(v) => onChange({ ...draft, degree: v })}
        />
        <Field
          label="Field of study"
          value={draft.field}
          onChange={(v) => onChange({ ...draft, field: v })}
        />
        <Field
          label="Location"
          value={draft.location}
          onChange={(v) => onChange({ ...draft, location: v })}
        />
        <Field
          label="Graduation date"
          value={draft.graduation_date}
          placeholder="YYYY-MM"
          onChange={(v) => onChange({ ...draft, graduation_date: v })}
        />
        <Field
          label="GPA (optional)"
          value={draft.gpa || ""}
          placeholder="3.8/4.0"
          onChange={(v) => onChange({ ...draft, gpa: v })}
        />
      </div>
    </SectionModal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
