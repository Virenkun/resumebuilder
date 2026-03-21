import React from "react";
import { PencilIcon } from "../icons/PencilIcon";

export function EducationSection({
  education,
  onEdit,
  onDelete,
  onAdd,
}: {
  education: any[];
  onEdit: (idx: number) => void;
  onDelete: (idx: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      {education.map((edu: any, idx: number) => (
        <div
          key={edu.id}
          className="flex items-start justify-between group/item"
        >
          <div className="text-sm text-gray-700">
            <span className="font-medium">
              {edu.degree} in {edu.field}
            </span>{" "}
            - {edu.institution} ({edu.graduation_date})
            {edu.gpa && (
              <span className="text-gray-500 ml-2">GPA: {edu.gpa}</span>
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
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-sm text-green-700 hover:text-green-800 font-medium"
      >
        + Add Education
      </button>
    </div>
  );
}
