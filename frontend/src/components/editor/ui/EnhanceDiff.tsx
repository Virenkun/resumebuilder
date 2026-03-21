import React from "react";

export function EnhanceDiff({
  original,
  enhanced,
  onAccept,
  onDiscard,
}: {
  original: string;
  enhanced: string;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed line-through text-red-400">
        {original}
      </p>
      <p className="text-sm leading-relaxed text-green-700">{enhanced}</p>
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
