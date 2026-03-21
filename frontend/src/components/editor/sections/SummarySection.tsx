import React from "react";
import { SparkleIcon } from "../icons/SparkleIcon";
import StarSearchIcon from "../../icons/start-search-icon";

export function SummarySection({
  summary,
  pendingEnhancement,
  isEnhancing,
  promptOpen,
  promptText,
  onEnhance,
  onTogglePrompt,
  onPromptChange,
  onPromptSubmit,
  onAccept,
  onDiscard,
}: {
  summary: string;
  pendingEnhancement: { original: string; enhanced: string } | null;
  isEnhancing: boolean;
  promptOpen: boolean;
  promptText: string;
  onEnhance: () => void;
  onTogglePrompt: () => void;
  onPromptChange: (v: string) => void;
  onPromptSubmit: () => void;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  if (pendingEnhancement) {
    return (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed line-through text-red-400">
          {pendingEnhancement.original}
        </p>
        <p className="text-sm leading-relaxed text-green-700">
          {pendingEnhancement.enhanced}
        </p>
        <div className="flex gap-2">
          <button
            onClick={onAccept}
            className="px-2 py-0.5 text-xs rounded font-medium"
            style={{ background: "rgba(34,197,94,0.12)", color: "#15803d" }}
          >
            Accept
          </button>
          <button
            onClick={onDiscard}
            className="px-2 py-0.5 text-xs rounded font-medium"
            style={{ background: "rgba(239,68,68,0.10)", color: "#dc2626" }}
          >
            Discard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group/summary space-y-1">
      <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      <div className="flex gap-1.5">
        <button
          onClick={onEnhance}
          disabled={isEnhancing}
          title="AI enhance"
          className="flex items-center gap-1 px-2 py-0.5 text-xs rounded text-gray-400 hover:text-green-700 disabled:opacity-40"
        >
          {isEnhancing ? (
            <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24">
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
          onClick={onTogglePrompt}
          title="Enhance with instruction"
          className="flex items-center gap-1 px-2 py-0.5 text-xs rounded text-gray-400 hover:text-green-700"
        >
          <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
          With prompt
        </button>
      </div>
      {promptOpen && (
        <div className="flex gap-2">
          <input
            autoFocus
            value={promptText}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onPromptSubmit();
              if (e.key === "Escape") onTogglePrompt();
            }}
            placeholder="e.g. make it more concise, add leadership focus…"
            className="flex-1 px-2 py-1 border border-green-200 rounded text-xs focus:ring-1 focus:ring-green-400 focus:border-transparent"
          />
          <button
            onClick={onPromptSubmit}
            disabled={isEnhancing}
            className="px-2 py-1 text-xs rounded font-medium disabled:opacity-40"
            style={{ background: "rgba(46,125,50,0.10)", color: "#2e7d32" }}
          >
            Enhance
          </button>
        </div>
      )}
    </div>
  );
}
