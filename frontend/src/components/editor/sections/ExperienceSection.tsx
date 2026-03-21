import { PencilIcon } from "../icons/PencilIcon";
import StarSearchIcon from "../../icons/start-search-icon";

export function ExperienceSection({
  experience,
  pendingEnhancements,
  enhancingViewBullet,
  viewPromptOpen,
  viewPromptText,
  onEdit,
  onDelete,
  onAdd,
  onEnhanceBullet,
  onAcceptBullet,
  onRejectBullet,
  onToggleBulletPrompt,
  onBulletPromptChange,
}: {
  experience: any[];
  pendingEnhancements: Record<string, { original: string; enhanced: string }>;
  enhancingViewBullet: string | null;
  viewPromptOpen: string | null;
  viewPromptText: Record<string, string>;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onEnhanceBullet: (expIdx: number, bIdx: number, instruction?: string) => void;
  onAcceptBullet: (expIdx: number, bIdx: number) => void;
  onRejectBullet: (expIdx: number, bIdx: number) => void;
  onToggleBulletPrompt: (key: string) => void;
  onBulletPromptChange: (key: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      {experience.map((exp: any, idx: number) => (
        <div
          key={exp.id}
          className="border-l-2 border-green-300 pl-4 group/item relative"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{exp.position}</h4>
              <p className="text-sm text-gray-600">
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""} | {exp.start_date} -{" "}
                {exp.end_date}
              </p>
            </div>
            <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
              <button
                onClick={() => onEdit(idx)}
                className="p-1.5 rounded text-gray-400 hover:text-green-700 hover:bg-green-50"
              >
                <PencilIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(idx)}
                className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          {exp.bullets.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {exp.bullets.map((bullet: string, bIdx: number) => {
                const key = `${idx}-${bIdx}`;
                const pending = pendingEnhancements[key];
                const isEnhancing = enhancingViewBullet === key;
                return (
                  <li key={bIdx} className="text-sm group/bullet">
                    {pending ? (
                      <div className="space-y-1">
                        <div className="pl-4 relative">
                          <span className="absolute left-0 text-red-400">
                            -
                          </span>
                          <span className="line-through text-red-400">
                            {pending.original}
                          </span>
                        </div>
                        <div className="pl-4 relative">
                          <span className="absolute left-0 text-green-500">
                            +
                          </span>
                          <span className="text-green-700">
                            {pending.enhanced}
                          </span>
                        </div>
                        <div className="flex gap-2 pl-4 pt-0.5">
                          <button
                            onClick={() => onAcceptBullet(idx, bIdx)}
                            className="px-2 py-0.5 text-xs rounded font-medium"
                            style={{
                              background: "rgba(34,197,94,0.12)",
                              color: "#15803d",
                            }}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onRejectBullet(idx, bIdx)}
                            className="px-2 py-0.5 text-xs rounded font-medium"
                            style={{
                              background: "rgba(239,68,68,0.10)",
                              color: "#dc2626",
                            }}
                          >
                            Discard
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-start gap-1 pl-4 relative">
                          <span className="absolute left-0 text-green-400">
                            -
                          </span>
                          <span className="flex-1 text-gray-700">{bullet}</span>
                          <div className="flex gap-0.5 flex-shrink-0">
                            {/* Quick enhance */}
                            <button
                              onClick={() => onEnhanceBullet(idx, bIdx)}
                              disabled={isEnhancing}
                              title="AI enhance"
                              className="p-0.5 text-gray-400 hover:text-green-700 disabled:opacity-40"
                            >
                              {isEnhancing ? (
                                <svg
                                  className="animate-spin w-3.5 h-3.5"
                                  viewBox="0 0 24 24"
                                >
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
                                <StarSearchIcon className="w-3.5 h-3.5" />
                              )}
                            </button>
                            {/* Enhance with prompt */}
                            <button
                              onClick={() => onToggleBulletPrompt(key)}
                              title="Enhance with instruction"
                              className="p-0.5 text-gray-400 hover:text-green-700"
                            >
                              <svg
                                className="w-3.5 h-3.5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {viewPromptOpen === key && (
                          <div className="flex gap-2 pl-4">
                            <input
                              autoFocus
                              value={viewPromptText[key] || ""}
                              onChange={(e) =>
                                onBulletPromptChange(key, e.target.value)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  onEnhanceBullet(
                                    idx,
                                    bIdx,
                                    viewPromptText[key],
                                  );
                                if (e.key === "Escape")
                                  onToggleBulletPrompt(key);
                              }}
                              placeholder="e.g. add metrics, focus on leadership…"
                              className="flex-1 px-2 py-1 border border-green-200 rounded text-xs focus:ring-1 focus:ring-green-400 focus:border-transparent"
                            />
                            <button
                              onClick={() =>
                                onEnhanceBullet(idx, bIdx, viewPromptText[key])
                              }
                              disabled={isEnhancing}
                              className="px-2 py-1 text-xs rounded font-medium disabled:opacity-40"
                              style={{
                                background: "rgba(46,125,50,0.10)",
                                color: "#2e7d32",
                              }}
                            >
                              Enhance
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm text-green-700 hover:text-green-800 font-medium"
      >
        + Add Experience
      </button>
    </div>
  );
}
