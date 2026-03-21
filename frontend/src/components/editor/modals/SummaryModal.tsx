import React from "react";
import { SectionModal } from "../ui/SectionModal";

export function SummaryModal({
  draft,
  onChange,
  onClose,
  onSave,
  onEnhance,
  enhancing,
}: {
  draft: string;
  onChange: (v: string) => void;
  onClose: () => void;
  onSave: () => void;
  onEnhance: () => void;
  enhancing: boolean;
}) {
  return (
    <SectionModal
      title="Edit Summary"
      onClose={onClose}
      onSave={onSave}
      onEnhance={onEnhance}
      enhancing={enhancing}
    >
      <textarea
        value={draft}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        rows={5}
        placeholder="Write a brief professional summary (2-3 sentences)..."
      />
      <p className="text-xs text-gray-400">
        Use AI Enhance to improve clarity, impact, and professionalism.
      </p>
    </SectionModal>
  );
}
