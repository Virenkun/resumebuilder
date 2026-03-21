import React from "react";

export function SkillsSection({ skills }: { skills: any }) {
  return (
    <div className="space-y-2">
      {(["technical", "languages", "frameworks", "tools"] as const).map(
        (cat) => {
          const items = skills[cat];
          if (!items?.length) return null;
          return (
            <div key={cat}>
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {cat}
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {items.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs"
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
