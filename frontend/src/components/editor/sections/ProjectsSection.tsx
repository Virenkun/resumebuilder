import StarSearchIcon from "../../icons/start-search-icon";
import { PencilIcon } from "../icons/PencilIcon";
import { SparkleIcon } from "../icons/SparkleIcon";

export function ProjectsSection({
  projects,
  pendingEnhancements,
  enhancingViewBullet,
  viewPromptOpen,
  viewPromptText,
  onEdit,
  onDelete,
  onAdd,
  onEnhanceProj,
  onAcceptProj,
  onRejectProj,
  onToggleProjPrompt,
  onProjPromptChange,
}: {
  projects: any[];
  pendingEnhancements: Record<string, { original: string; enhanced: string }>;
  enhancingViewBullet: string | null;
  viewPromptOpen: string | null;
  viewPromptText: Record<string, string>;
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
  onEnhanceProj: (idx: number, instruction?: string) => void;
  onAcceptProj: (idx: number) => void;
  onRejectProj: (idx: number) => void;
  onToggleProjPrompt: (key: string) => void;
  onProjPromptChange: (key: string, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      {projects.map((proj: any, idx: number) => (
        <div
          key={proj.id || idx}
          className="border-l-2 border-green-300 pl-4 group/item"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">{proj.name}</h4>
              {proj.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {proj.technologies.map((tech: string, tIdx: number) => (
                    <span
                      key={tIdx}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
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
          {proj.description &&
            (() => {
              const key = `proj-${idx}`;
              const pending = pendingEnhancements[key];
              const isEnhancing = enhancingViewBullet === key;
              return pending ? (
                <div className="mt-1 space-y-1">
                  <p className="text-sm leading-relaxed line-through text-red-400">
                    {pending.original}
                  </p>
                  <p className="text-sm leading-relaxed text-green-700">
                    {pending.enhanced}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptProj(idx)}
                      className="px-2 py-0.5 text-xs rounded font-medium"
                      style={{
                        background: "rgba(34,197,94,0.12)",
                        color: "#15803d",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onRejectProj(idx)}
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
                <div className="mt-1 group/projdesc space-y-1">
                  <p className="text-sm text-gray-600">{proj.description}</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onEnhanceProj(idx)}
                      disabled={isEnhancing}
                      title="AI enhance"
                      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded text-gray-400 hover:text-green-700 disabled:opacity-40"
                    >
                      {isEnhancing ? (
                        <svg
                          className="animate-spin w-3 h-3"
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
                        <StarSearchIcon className="w-3 h-3" />
                      )}
                      Enhance
                    </button>
                    <button
                      onClick={() => onToggleProjPrompt(key)}
                      title="Enhance with instruction"
                      className="flex items-center gap-1 px-2 py-0.5 text-xs rounded text-gray-400 hover:text-green-700"
                    >
                      <svg
                        className="w-3 h-3"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      With prompt
                    </button>
                  </div>
                  {viewPromptOpen === key && (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={viewPromptText[key] || ""}
                        onChange={(e) =>
                          onProjPromptChange(key, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            onEnhanceProj(idx, viewPromptText[key]);
                          if (e.key === "Escape") onToggleProjPrompt(key);
                        }}
                        placeholder="e.g. highlight impact, mention scale…"
                        className="flex-1 px-2 py-1 border border-green-200 rounded text-xs focus:ring-1 focus:ring-green-400 focus:border-transparent"
                      />
                      <button
                        onClick={() => onEnhanceProj(idx, viewPromptText[key])}
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
              );
            })()}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-green-700 hover:underline mt-1 inline-block"
            >
              {proj.link}
            </a>
          )}
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm text-green-700 hover:text-green-800 font-medium"
      >
        + Add Project
      </button>
    </div>
  );
}
