
export function PersonalInfoSection({ personal }: { personal: any }) {
  return (
    <div className="space-y-1.5">
      <p className="font-display text-xl text-foreground">
        {personal.name || "No name"}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {personal.email && <span>{personal.email}</span>}
        {personal.phone && <span>{personal.phone}</span>}
        {personal.location && <span>{personal.location}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 text-sm font-semibold text-[#054d28]">
        {personal.linkedin && <span>{personal.linkedin}</span>}
        {personal.github && <span>{personal.github}</span>}
        {personal.website && <span>{personal.website}</span>}
      </div>
    </div>
  );
}
