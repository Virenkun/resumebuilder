import { Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { HintTip } from "../ui/HintTip";

export function SummarySection({
  summary,
  pendingEnhancement,
  isEnhancing,
  promptOpen,
  promptText,
  onEnhance,
  onTogglePrompt,
  onPromptChange,
  onPromptSubmit,
  onAccept,
  onDiscard,
}: {
  summary: string;
  pendingEnhancement: { original: string; enhanced: string } | null;
  isEnhancing: boolean;
  promptOpen: boolean;
  promptText: string;
  onEnhance: () => void;
  onTogglePrompt: () => void;
  onPromptChange: (v: string) => void;
  onPromptSubmit: () => void;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  if (pendingEnhancement) {
    return (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed text-destructive/70 line-through">
          {pendingEnhancement.original}
        </p>
        <p className="text-sm font-medium leading-relaxed text-[#054d28]">
          {pendingEnhancement.enhanced}
        </p>
        <div className="flex gap-2 pt-1">
          <HintTip label="Keep the AI rewrite">
            <button
              onClick={onAccept}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-[#054d28] hover:bg-accent"
            >
              Accept
            </button>
          </HintTip>
          <HintTip label="Discard the rewrite and keep the original">
            <button
              onClick={onDiscard}
              className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive hover:bg-destructive/15"
            >
              Discard
            </button>
          </HintTip>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm leading-relaxed text-foreground">{summary}</p>
      <div className="flex flex-wrap gap-2">
        <HintTip label="Rewrite your summary with AI">
          <button
            onClick={onEnhance}
            disabled={isEnhancing}
            aria-label="AI enhance summary"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-[#054d28] disabled:opacity-40"
          >
            {isEnhancing ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Sparkles className="size-3" />
            )}
            Enhance
          </button>
        </HintTip>
        <HintTip label="Rewrite with a custom instruction">
          <button
            onClick={onTogglePrompt}
            aria-label="Enhance summary with instruction"
            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-[#054d28]"
          >
            <MessageSquareText className="size-3" />
            With prompt
          </button>
        </HintTip>
      </div>
      {promptOpen && (
        <div className="flex gap-2">
          <input
            autoFocus
            value={promptText}
            onChange={(e) => onPromptChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onPromptSubmit();
              if (e.key === "Escape") onTogglePrompt();
            }}
            placeholder="e.g. make it more concise, add leadership focus…"
            className="flex-1 rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-3 py-1.5 text-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            onClick={onPromptSubmit}
            disabled={isEnhancing}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95] disabled:opacity-40"
          >
            Enhance
          </button>
        </div>
      )}
    </div>
  );
}
