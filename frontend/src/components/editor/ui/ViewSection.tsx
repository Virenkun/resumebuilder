import React from "react";
import { Pencil, Plus } from "lucide-react";
import { HintTip } from "./HintTip";

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
    <section className="border group rounded-3xl bg-card p-6 mr-3">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
        <HintTip label={`Edit ${title}`}>
          <button
            onClick={onEdit}
            aria-label={`Edit ${title}`}
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-[#054d28]"
          >
            <Pencil className="size-3.5" />
          </button>
        </HintTip>
      </div>
      {isEmpty ? (
        <HintTip label={`Add a new ${title.toLowerCase()} entry`}>
          <button
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[rgba(14,15,12,0.12)] px-4 py-6 text-sm font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-[#054d28]"
          >
            <Plus className="size-4" />
            Add {title}
          </button>
        </HintTip>
      ) : (
        children
      )}
    </section>
  );
}
