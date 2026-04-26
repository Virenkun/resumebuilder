import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionModal } from "../ui/SectionModal";

export function PersonalInfoModal({
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
    <SectionModal title="Edit personal info" onClose={onClose} onSave={onSave}>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Full name"
          className="col-span-2"
          value={draft.name}
          onChange={(v) => onChange({ ...draft, name: v })}
        />
        <Field
          label="Email"
          type="email"
          value={draft.email}
          onChange={(v) => onChange({ ...draft, email: v })}
        />
        <Field
          label="Phone"
          value={draft.phone}
          onChange={(v) => onChange({ ...draft, phone: v })}
        />
        <Field
          label="Location"
          className="col-span-2"
          value={draft.location}
          onChange={(v) => onChange({ ...draft, location: v })}
        />
        <Field
          label="LinkedIn"
          value={draft.linkedin || ""}
          placeholder="linkedin.com/in/…"
          onChange={(v) => onChange({ ...draft, linkedin: v })}
        />
        <Field
          label="GitHub"
          value={draft.github || ""}
          placeholder="github.com/…"
          onChange={(v) => onChange({ ...draft, github: v })}
        />
        <Field
          label="Website"
          className="col-span-2"
          value={draft.website || ""}
          placeholder="yoursite.com"
          onChange={(v) => onChange({ ...draft, website: v })}
        />
      </div>
    </SectionModal>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
