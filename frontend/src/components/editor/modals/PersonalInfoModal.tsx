import React from "react";
import { SectionModal } from "../ui/SectionModal";

export function PersonalInfoModal({
  draft,
  onChange,
  onClose,
  onSave,
}: {
  draft: any;
  onChange: (d: any) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  return (
    <SectionModal title="Edit Personal Info" onClose={onClose} onSave={onSave}>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            value={draft.name}
            onChange={(e) => onChange({ ...draft, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={draft.email}
            onChange={(e) => onChange({ ...draft, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            value={draft.phone}
            onChange={(e) => onChange({ ...draft, phone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div className="col-span-2">
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
            LinkedIn
          </label>
          <input
            value={draft.linkedin || ""}
            onChange={(e) => onChange({ ...draft, linkedin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GitHub
          </label>
          <input
            value={draft.github || ""}
            onChange={(e) => onChange({ ...draft, github: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="github.com/..."
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <input
            value={draft.website || ""}
            onChange={(e) => onChange({ ...draft, website: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="yoursite.com"
          />
        </div>
      </div>
    </SectionModal>
  );
}
