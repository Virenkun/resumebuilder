import React from "react";
import { SparkleIcon } from "../icons/SparkleIcon";
import StarSearchIcon from "../../icons/start-search-icon";

export function SectionModal({
  title,
  onClose,
  onSave,
  children,
  enhancing,
  onEnhance,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  enhancing?: boolean;
  onEnhance?: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
        style={{
          background: "#ffffff",
          boxShadow:
            "0 24px 64px rgba(13,148,136,0.18), 0 4px 16px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #e0d6c9" }}
        >
          <h3 className="text-base font-bold" style={{ color: "#1b5e20" }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-lg leading-none cursor-pointer"
            style={{ color: "#a1887f" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "#f1f5f9";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }}
          >
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-auto px-6 py-5 space-y-4">
          {children}
        </div>
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid #e0d6c9", background: "#f8f5f0" }}
        >
          <div>
            {onEnhance && (
              <button
                onClick={onEnhance}
                disabled={enhancing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #2e7d32, #388e3c)",
                }}
              >
                {enhancing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    Enhancing…
                  </>
                ) : (
                  <>
                    <StarSearchIcon className="w-4 h-4" />
                    AI Enhance
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ border: "1.5px solid #e0d6c9", color: "#475569" }}
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer"
              style={{ background: "#2e7d32" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
