import { useState, useCallback } from "react";
import { Document, Page } from "react-pdf";
import { Minus, Plus, X } from "lucide-react";
import { usePdfBlobUrl } from "./usePdfBlobUrl";

export function TemplatePreviewModal({
  templateId,
  onClose,
}: {
  templateId: string;
  onClose: () => void;
}) {
  const [scale, setScale] = useState(1.2);
  const [numPages, setNumPages] = useState(1);
  const { blobUrl } = usePdfBlobUrl(templateId);

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3)), []);
  const zoomOut = useCallback(
    () => setScale((s) => Math.max(s - 0.2, 0.5)),
    [],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="shadow-ring flex h-full max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[rgba(14,15,12,0.08)] px-6 py-4">
          <h3 className="font-display text-xl text-foreground">
            Template preview
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              <button
                onClick={zoomOut}
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-12 text-center text-xs font-semibold text-foreground">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 justify-center overflow-auto bg-muted p-6">
          <Document
            file={blobUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-muted-foreground">Loading PDF…</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center py-20">
                <p className="text-sm text-destructive">
                  Failed to load preview
                </p>
              </div>
            }
          >
            <div className="space-y-4">
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="shadow-ring overflow-hidden rounded-2xl">
                  <Page
                    pageNumber={i + 1}
                    scale={scale}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </div>
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}
