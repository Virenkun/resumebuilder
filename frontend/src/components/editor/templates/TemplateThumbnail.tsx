import { useState } from "react";
import apiClient from "../../../services/apiClient";

export function TemplateThumbnail({ templateId }: { templateId: string }) {
  const [errored, setErrored] = useState(false);
  const baseUrl = apiClient.defaults.baseURL || "http://localhost:8000";
  const src = `${baseUrl}/api/templates/${templateId}/thumbnail`;

  if (errored) {
    return (
      <div className="flex h-44 w-full items-center justify-center bg-gray-50">
        <p className="text-xs text-gray-400">Preview unavailable</p>
      </div>
    );
  }

  return (
    <div className="h-44 w-full overflow-hidden bg-white">
      <img
        src={src}
        alt={`${templateId} template preview`}
        loading="lazy"
        onError={() => setErrored(true)}
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}
