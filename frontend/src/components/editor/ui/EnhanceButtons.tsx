import { Loader2, MessageSquareText, Sparkles } from "lucide-react";
import { HintTip } from "./HintTip";

export function EnhanceButtons({
  isEnhancing,
  promptOpen,
  promptText,
  onEnhance,
  onTogglePrompt,
  onPromptChange,
  onPromptSubmit,
  placeholder,
}: {
  isEnhancing: boolean;
  promptOpen: boolean;
  promptText: string;
  onEnhance: () => void;
  onTogglePrompt: () => void;
  onPromptChange: (v: string) => void;
  onPromptSubmit: () => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1.5">
        <HintTip label="Rewrite with AI">
          <button
            onClick={onEnhance}
            disabled={isEnhancing}
            aria-label="AI enhance"
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#054d28] disabled:opacity-40"
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
            aria-label="Enhance with instruction"
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-[#054d28]"
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
            placeholder={
              placeholder || "e.g. make it more concise, add leadership focus…"
            }
            className="flex-1 rounded-full border border-input bg-background px-3 py-1 text-xs text-foreground outline-none transition-shadow focus:shadow-ring-green"
          />
          <button
            onClick={onPromptSubmit}
            disabled={isEnhancing}
            className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-bold text-[#054d28] transition-colors hover:bg-accent disabled:opacity-40"
          >
            Enhance
          </button>
        </div>
      )}
    </div>
  );
}
