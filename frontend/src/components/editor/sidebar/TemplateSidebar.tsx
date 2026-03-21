import React from "react";
import { TemplateThumbnail } from "../templates/TemplateThumbnail";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export function TemplateSidebar({
  templates,
  selectedTemplate,
  onSelect,
  previewTemplate,
  onTogglePreview,
}: {
  templates: TemplateInfo[];
  selectedTemplate: string;
  onSelect: (id: string) => void;
  previewTemplate: string | null;
  onTogglePreview: (id: string) => void;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(153,246,228,0.40)",
        boxShadow: "0 2px 16px rgba(13,148,136,0.06)",
      }}
    >
      <h3
        className="font-bold mb-3 text-sm tracking-wide"
        style={{ color: "#1b5e20" }}
      >
        Template
      </h3>
      <div className="space-y-3">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onSelect(tpl.id)}
            className={`rounded-lg border-2 cursor-pointer transition-all overflow-hidden ${
              selectedTemplate === tpl.id
                ? "border-green-500 ring-2 ring-green-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {/* PDF Preview Thumbnail */}
            <div className="bg-gray-100 relative group">
              <TemplateThumbnail templateId={tpl.id} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePreview(tpl.id);
                }}
                className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 rounded text-xs text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-white"
              >
                Preview
              </button>
            </div>
            <div className="p-2.5">
              <div className="flex items-center gap-2">
                {selectedTemplate === tpl.id && (
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                )}
                <p className="font-medium text-gray-900 text-sm">{tpl.name}</p>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{tpl.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
