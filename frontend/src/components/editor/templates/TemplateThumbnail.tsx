import { Document, Page } from "react-pdf";
import { usePdfBlobUrl } from "./usePdfBlobUrl";

export function TemplateThumbnail({ templateId }: { templateId: string }) {
  const { blobUrl, error } = usePdfBlobUrl(templateId);

  if (error) {
    return (
      <div className="h-44 flex items-center justify-center bg-gray-50">
        <p className="text-xs text-gray-400">Preview unavailable</p>
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="h-44 flex items-center justify-center bg-gray-50">
        <p className="text-xs text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="h-44 overflow-hidden flex justify-center bg-white">
      <Document file={blobUrl} loading="">
        <Page
          pageNumber={1}
          width={220}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    </div>
  );
}
