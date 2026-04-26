import { Check, X } from "lucide-react";

export function EnhanceDiff({
  original,
  enhanced,
  onAccept,
  onDiscard,
}: {
  original: string;
  enhanced: string;
  onAccept: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm leading-relaxed text-muted-foreground line-through">
        {original}
      </p>
      <p className="text-sm leading-relaxed text-[#054d28]">{enhanced}</p>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-0.5 text-xs font-bold text-[#054d28] transition-colors hover:bg-accent"
        >
          <Check className="size-3" />
          Accept
        </button>
        <button
          onClick={onDiscard}
          className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-3 py-0.5 text-xs font-bold text-destructive transition-colors hover:bg-destructive/15"
        >
          <X className="size-3" />
          Discard
        </button>
      </div>
    </div>
  );
}
