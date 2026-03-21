import React from "react";
import { SectionModal } from "../ui/SectionModal";

export function EducationModal({
  draft,
  onChange,
  onClose,
  onSave,
  isEditing,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
  isEditing: boolean;
}) {
  return (
    <SectionModal
      title={isEditing ? "Edit Education" : "Add Education"}
      onClose={onClose}
      onSave={onSave}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution
          </label>
          <input
            value={draft.institution}
            onChange={(e) =>
              onChange({ ...draft, institution: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree
          </label>
          <input
            value={draft.degree}
            onChange={(e) => onChange({ ...draft, degree: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Bachelor of Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Field of Study
          </label>
          <input
            value={draft.field}
            onChange={(e) => onChange({ ...draft, field: e.target.value })}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Date
          </label>
          <input
            value={draft.graduation_date}
            onChange={(e) =>
              onChange({ ...draft, graduation_date: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="YYYY-MM"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GPA (optional)
          </label>
          <input
            value={draft.gpa || ""}
            onChange={(e) => onChange({ ...draft, gpa: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="3.8/4.0"
          />
        </div>
      </div>
    </SectionModal>
  );
}
