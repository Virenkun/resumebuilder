import { useState, useCallback } from "react";
import { Document, Page } from "react-pdf";
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
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with zoom controls */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0">
          <h3 className="font-semibold text-gray-900">Template Preview</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={zoomOut}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:shadow-sm transition-all text-lg"
              >
                -
              </button>
              <span className="text-xs text-gray-600 w-12 text-center font-medium">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-white hover:shadow-sm transition-all text-lg"
              >
                +
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none ml-2"
            >
              &times;
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-6 flex justify-center">
          <Document
            file={blobUrl}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-400">Loading PDF...</p>
              </div>
            }
            error={
              <div className="flex items-center justify-center py-20">
                <p className="text-red-400">Failed to load preview</p>
              </div>
            }
          >
            <div className="space-y-4">
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i} className="shadow-lg">
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
