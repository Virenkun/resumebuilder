import React from "react";
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
    <SectionModal title="Edit Skills" onClose={onClose} onSave={onSave}>
      {(["technical", "languages", "frameworks", "tools"] as const).map(
        (cat) => (
          <div key={cat}>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {cat}
            </label>
            <input
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder={`Enter ${cat} skills, separated by commas...`}
            />
          </div>
        ),
      )}
      <p className="text-xs text-gray-400">Separate each skill with a comma.</p>
    </SectionModal>
  );
}
