import { useState, useEffect } from "react";
import apiClient from "../../../services/apiClient";

export function usePdfBlobUrl(templateId: string) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let url: string | null = null;
    const baseUrl = apiClient.defaults.baseURL || "http://localhost:8000";

    fetch(`${baseUrl}/api/templates/${templateId}/preview`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.blob();
      })
      .then((blob) => {
        url = URL.createObjectURL(blob);
        setBlobUrl(url);
      })
      .catch(() => setError(true));

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [templateId]);

  return { blobUrl, error };
}
