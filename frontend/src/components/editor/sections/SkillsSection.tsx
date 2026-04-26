export function SkillsSection({ skills }: { skills: any }) {
  return (
    <div className="space-y-3">
      {(["technical", "languages", "frameworks", "tools"] as const).map(
        (cat) => {
          const items = skills[cat];
          if (!items?.length) return null;
          return (
            <div key={cat}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {cat}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {items.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-[#054d28]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
