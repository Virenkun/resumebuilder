import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page } from "react-pdf";
import { AlertCircle, ArrowLeft, Download, Loader2, Minus, Plus } from "lucide-react";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";

export default function Preview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentResume } = useResumeStore();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1.3);

  const resumeId = id || currentResume?.id;

  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3)), []);
  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.5)), []);

  useEffect(() => {
    if (!resumeId) {
      setError("No resume ID found");
      setLoading(false);
      return;
    }
    const baseUrl = apiClient.defaults.baseURL || "http://localhost:8000";
    const url = `${baseUrl}/api/download/pdf/${resumeId}`;
    fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.blob().then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            setPdfUrl(blobUrl);
          });
        } else {
          setError(
            "PDF not found. Please compile your resume from the editor first.",
          );
        }
      })
      .catch(() => setError("Could not connect to the server."))
      .finally(() => setLoading(false));
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [resumeId]);

  const handleDownloadPdf = () => {
    if (resumeId) {
      const baseUrl = apiClient.defaults.baseURL || "http://localhost:8000";
      window.open(`${baseUrl}/api/download/pdf/${resumeId}`, "_blank");
    }
  };

  const handleDownloadLatex = () => {
    if (resumeId) {
      const baseUrl = apiClient.defaults.baseURL || "http://localhost:8000";
      window.open(`${baseUrl}/api/download/latex/${resumeId}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-[rgba(14,15,12,0.08)] bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                navigate(resumeId ? `/editor/${resumeId}` : "/editor")
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to editor
            </button>
            <div className="h-5 w-px bg-border" />
            <h1 className="font-display text-xl text-foreground">
              Resume preview
            </h1>
          </div>

          <div className="flex items-center gap-2">
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
            <Button variant="outline" size="sm" onClick={handleDownloadLatex}>
              .tex
            </Button>
            <Button size="sm" onClick={handleDownloadPdf} disabled={!pdfUrl}>
              <Download className="size-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="mx-auto mb-4 size-8 animate-spin text-[#054d28]" />
              <p className="text-sm text-muted-foreground">Loading preview…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <div className="shadow-ring mx-auto max-w-md rounded-3xl bg-card p-8">
              <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="size-5" />
              </div>
              <p className="mb-6 text-sm leading-relaxed text-foreground">
                {error}
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(resumeId ? `/editor/${resumeId}` : "/editor")
                  }
                >
                  Go to editor
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
              </div>
            </div>
          </div>
        )}

        {pdfUrl && !loading && (
          <div className="flex max-h-[85vh] flex-col items-center overflow-auto">
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              loading=""
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div
                  key={i + 1}
                  className="shadow-ring mb-5 overflow-hidden rounded-2xl"
                >
                  <Page
                    pageNumber={i + 1}
                    scale={scale}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                  />
                </div>
              ))}
            </Document>
          </div>
        )}
      </main>
    </div>
  );
}
