import StarSearchIcon from "../../icons/start-search-icon";
import { SectionModal } from "../ui/SectionModal";

export function ExperienceModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhanceAll,
  enhancing,
  enhancingBulletIdx,
  enhancedBulletIdxs,
  bulletInstructions,
  onBulletInstructionChange,
  onEnhanceBullet,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhanceAll: () => void;
  enhancing: boolean;
  enhancingBulletIdx: number | null;
  enhancedBulletIdxs: Set<number>;
  bulletInstructions: Record<number, string>;
  onBulletInstructionChange: (idx: number, v: string) => void;
  onEnhanceBullet: (idx: number, instruction?: string) => void;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit Experience" : "Add Experience"}
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhanceAll}
      enhancing={enhancing}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Position
          </label>
          <input
            value={draft.position}
            onChange={(e) => onChange({ ...draft, position: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            value={draft.company}
            onChange={(e) => onChange({ ...draft, company: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            value={draft.location}
            onChange={(e) => onChange({ ...draft, location: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start
            </label>
            <input
              value={draft.start_date}
              onChange={(e) =>
                onChange({ ...draft, start_date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="YYYY-MM"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End
            </label>
            <input
              value={draft.end_date}
              onChange={(e) => onChange({ ...draft, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="YYYY-MM or Present"
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bullet Points
        </label>
        <div className="space-y-2">
          {draft.bullets.map((bullet: string, bIdx: number) => (
            <div key={bIdx} className="space-y-1">
              <div className="flex gap-2">
                <textarea
                  value={bullet}
                  onChange={(e) => {
                    const bullets = [...draft.bullets];
                    bullets[bIdx] = e.target.value;
                    onChange({ ...draft, bullets });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                  placeholder="Describe an accomplishment..."
                />
                <button
                  onClick={() => onEnhanceBullet(bIdx)}
                  disabled={enhancingBulletIdx === bIdx}
                  title="AI enhance this bullet"
                  className="self-start p-2 text-gray-400 hover:text-green-700 disabled:opacity-40 transition-colors"
                >
                  {enhancingBulletIdx === bIdx ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  ) : (
                    <StarSearchIcon className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    const bullets = draft.bullets.filter(
                      (_: any, i: number) => i !== bIdx,
                    );
                    onChange({
                      ...draft,
                      bullets: bullets.length ? bullets : [""],
                    });
                  }}
                  className="self-start p-2 text-gray-400 hover:text-red-500"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {enhancedBulletIdxs.has(bIdx) && (
                <div className="flex gap-2 pl-0">
                  <input
                    value={bulletInstructions[bIdx] || ""}
                    onChange={(e) =>
                      onBulletInstructionChange(bIdx, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        onEnhanceBullet(bIdx, bulletInstructions[bIdx]);
                    }}
                    placeholder="Instruction for re-enhancement (e.g. add metrics, focus on leadership)…"
                    className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-green-400 focus:border-transparent"
                  />
                  <button
                    onClick={() =>
                      onEnhanceBullet(bIdx, bulletInstructions[bIdx])
                    }
                    disabled={enhancingBulletIdx === bIdx}
                    className="px-2 py-1 text-xs rounded font-medium disabled:opacity-40 transition-colors"
                    style={{
                      background: "rgba(46,125,50,0.10)",
                      color: "#2e7d32",
                    }}
                  >
                    Re-enhance
                  </button>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() =>
              onChange({
                ...draft,
                bullets: [...draft.bullets, ""],
              })
            }
            className="text-sm text-green-700 hover:text-green-800 font-medium"
          >
            + Add Bullet
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        AI Enhance will rewrite bullets with action verbs and quantified impact.
      </p>
    </SectionModal>
  );
}
