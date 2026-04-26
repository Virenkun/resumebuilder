import { Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function SectionModal({
  title,
  onClose,
  onSave,
  children,
  enhancing,
  onEnhance,
}: {
  title: string;
  onClose: () => void;
  onSave: () => void;
  children: React.ReactNode;
  enhancing?: boolean;
  onEnhance?: () => void;
}) {
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-[rgba(14,15,12,0.08)] px-6 py-4">
          <DialogTitle className="font-display text-xl text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-auto px-6 py-5">{children}</div>

        <DialogFooter className="flex items-center gap-3 border-t border-[rgba(14,15,12,0.08)] bg-muted/60 px-6 py-4 sm:justify-between">
          <div>
            {onEnhance && (
              <Button
                variant="subtle"
                size="sm"
                onClick={onEnhance}
                disabled={enhancing}
              >
                {enhancing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    AI enhance
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
