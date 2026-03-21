import React from "react";

export function PersonalInfoSection({ personal }: { personal: any }) {
  return (
    <div className="space-y-1">
      <p className="text-lg font-medium text-gray-900">
        {personal.name || "No name"}
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        {personal.email && <span>{personal.email}</span>}
        {personal.phone && <span>{personal.phone}</span>}
        {personal.location && <span>{personal.location}</span>}
      </div>
      <div className="flex flex-wrap gap-x-4 text-sm text-green-700">
        {personal.linkedin && <span>{personal.linkedin}</span>}
        {personal.github && <span>{personal.github}</span>}
        {personal.website && <span>{personal.website}</span>}
      </div>
    </div>
  );
}
