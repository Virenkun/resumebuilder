import React from "react";
import { AddIcon } from "../icons/AddIcon";

export function ViewSection({
  title,
  onEdit,
  isEmpty,
  children,
}: {
  title: string;
  onEdit: () => void;
  isEmpty?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 group"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(153,246,228,0.40)",
        boxShadow: "0 2px 16px rgba(13,148,136,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="font-bold text-sm tracking-wide"
          style={{ color: "#1b5e20" }}
        >
          {title}
        </h3>
        <button
          onClick={onEdit}
          className="p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
          style={{ color: "#a1887f" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#2e7d32";
            (e.currentTarget as HTMLElement).style.background =
              "rgba(46,125,50,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#a1887f";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
          title={`Edit ${title}`}
        >
          <AddIcon />
        </button>
      </div>
      {isEmpty ? (
        <button
          onClick={onEdit}
          className="w-full py-6 rounded-xl text-sm font-medium cursor-pointer transition-colors"
          style={{ border: "2px dashed #c8e6c9", color: "#a1887f" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#2e7d32";
            (e.currentTarget as HTMLElement).style.color = "#2e7d32";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "#c8e6c9";
            (e.currentTarget as HTMLElement).style.color = "#a1887f";
          }}
        >
          + Add {title}
        </button>
      ) : (
        children
      )}
    </div>
  );
}
