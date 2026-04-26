import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Choice = "original" | "tailored";

export function CompareCard({
  title,
  changed,
  choice,
  onChange,
  original,
  tailored,
  rationale,
}: {
  title: string;
  changed: boolean;
  choice: Choice;
  onChange: (c: Choice) => void;
  original: ReactNode;
  tailored: ReactNode;
  rationale?: string;
}) {
  return (
    <div className="shadow-ring overflow-hidden rounded-3xl bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-[rgba(14,15,12,0.08)] bg-muted/50 px-5 py-3">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {changed ? (
            <span className="rounded-full bg-[#ffd11a]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#754f00]">
              Changed
            </span>
          ) : (
            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Unchanged
            </span>
          )}
        </div>
        <div className="flex gap-1 rounded-full bg-muted p-1">
          <button
            onClick={() => onChange("original")}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              choice === "original"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Keep original
          </button>
          <button
            onClick={() => onChange("tailored")}
            disabled={!changed}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
              choice === "tailored"
                ? "bg-primary text-[#163300] shadow-sm"
                : "text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            Use tailored
          </button>
        </div>
      </div>

      {rationale && changed && (
        <div className="flex gap-2 border-b border-[rgba(14,15,12,0.08)] bg-[#fff8db] px-5 py-3 text-sm text-[#754f00]">
          <span className="shrink-0 font-bold">Why:</span>
          <span>{rationale}</span>
        </div>
      )}

      <div className="grid grid-cols-1 divide-y divide-[rgba(14,15,12,0.08)] md:grid-cols-2 md:divide-x md:divide-y-0">
        <div
          className={cn(
            "p-5 text-sm",
            choice === "original" ? "bg-secondary/40" : "bg-card",
          )}
        >
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Original
          </div>
          {original}
        </div>
        <div
          className={cn(
            "p-5 text-sm",
            choice === "tailored" ? "bg-secondary/40" : "bg-card",
          )}
        >
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Tailored
          </div>
          {tailored}
        </div>
      </div>
    </div>
  );
}

export type { Choice };
