import React from "react";
import { SectionModal } from "../ui/SectionModal";

export function ProjectModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhance,
  enhancing,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhance: () => void;
  enhancing: boolean;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit Project" : "Add Project"}
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhance}
      enhancing={enhancing}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={draft.description}
            onChange={(e) =>
              onChange({ ...draft, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            placeholder="Describe the project..."
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technologies
          </label>
          <input
            value={draft.technologies.join(", ")}
            onChange={(e) =>
              onChange({
                ...draft,
                technologies: e.target.value
                  .split(",")
                  .map((s: string) => s.trim())
                  .filter(Boolean),
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="React, Node.js, PostgreSQL..."
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link (optional)
          </label>
          <input
            value={draft.link || ""}
            onChange={(e) => onChange({ ...draft, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>
      <p className="text-xs text-gray-400">
        AI Enhance will improve your project description.
      </p>
    </SectionModal>
  );
}
