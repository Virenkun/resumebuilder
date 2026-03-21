import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url,
).toString();

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
          setError("PDF not found. Please compile your resume from the Editor first.");
        }
      })
      .catch(() => {
        setError("Could not connect to the server.");
      })
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
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)" }}>

      {/* Header */}
      <div style={{ background: "rgba(255,255,255,0.90)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(153,246,228,0.40)", boxShadow: "0 1px 12px rgba(46,125,50,0.08)" }}>
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(resumeId ? `/editor/${resumeId}` : "/editor")}
              className="inline-flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
              style={{ color: "#2e7d32" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back to Editor
            </button>
            <div style={{ width: "1px", height: "20px", background: "#e0d6c9" }} />
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "#1b5e20" }}>
              Resume Preview
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Zoom controls */}
            <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(46,125,50,0.08)" }}>
              <button
                onClick={zoomOut}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold cursor-pointer transition-colors"
                style={{ color: "#2e7d32" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                −
              </button>
              <span className="text-xs font-semibold w-12 text-center" style={{ color: "#2e7d32" }}>
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-base font-bold cursor-pointer transition-colors"
                style={{ color: "#2e7d32" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                +
              </button>
            </div>

            <button
              onClick={handleDownloadLatex}
              className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              style={{ border: "1.5px solid #e0d6c9", color: "#475569", background: "white" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f8f5f0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "white"; }}
            >
              Download .tex
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={!pdfUrl}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
              style={{ background: "#2e7d32" }}
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-4" viewBox="0 0 24 24" style={{ color: "#2e7d32" }}>
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-sm" style={{ color: "#6d4c41" }}>Loading preview…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="rounded-2xl p-8 max-w-md mx-auto"
              style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(153,246,228,0.40)", boxShadow: "0 4px 24px rgba(46,125,50,0.08)" }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(234,88,12,0.10)", color: "#ea580c" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: "#475569" }}>{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate(resumeId ? `/editor/${resumeId}` : "/editor")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                  style={{ background: "#2e7d32" }}
                >
                  Go to Editor
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
                  style={{ border: "1.5px solid #e0d6c9", color: "#475569" }}
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        )}

        {pdfUrl && !loading && (
          <div className="overflow-auto flex flex-col items-center" style={{ maxHeight: "85vh" }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages: n }) => setNumPages(n)}
              loading=""
            >
              {Array.from({ length: numPages }, (_, i) => (
                <div key={i + 1} className="mb-4 rounded-xl overflow-hidden"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.12)" }}>
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
      </div>
    </div>
  );
}
