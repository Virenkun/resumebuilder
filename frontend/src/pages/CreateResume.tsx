import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ResumeForm from "../components/forms/ResumeForm";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";

export default function CreateResume() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "form";

  if (mode === "upload") {
    return <UploadMode />;
  }

  if (mode === "jd") {
    return <JDMode />;
  }

  // Default: form mode
  return <ResumeForm />;
}

/* ---------- Spinner ---------- */
function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

/* ---------- Back Button ---------- */
function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm font-medium mb-8 cursor-pointer"
      style={{ color: "#2e7d32" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Back to Home
    </button>
  );
}

/* ---------- Upload Mode ---------- */
function UploadMode() {
  const navigate = useNavigate();
  const { setResume } = useResumeStore();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExts = [".pdf", ".docx"];
    const ext = f.name.toLowerCase().slice(f.name.lastIndexOf("."));

    if (!validTypes.includes(f.type) && !validExts.includes(ext)) {
      setError("Please upload a PDF or DOCX file");
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("File size must be under 10MB");
      return;
    }

    setFile(f);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await apiClient.post("/api/upload/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000,
      });

      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
        navigate("/editor");
      } else {
        setError("Failed to parse resume");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)" }}>
      <div className="max-w-2xl mx-auto px-4">
        <BackButton onClick={() => navigate("/")} />

        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: "#1b5e20" }}>
          Upload Resume
        </h1>
        <p className="mb-8 text-base" style={{ color: "#6d4c41" }}>
          Upload your existing resume and AI will parse it into structured data you can edit and enhance.
        </p>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="rounded-2xl p-12 text-center cursor-default"
          style={{
            border: `2px dashed ${dragOver ? "#2e7d32" : file ? "#4caf50" : "#c8e6c9"}`,
            background: dragOver ? "rgba(13,148,136,0.06)" : file ? "rgba(45,212,191,0.06)" : "rgba(255,255,255,0.80)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: "all 200ms ease",
          }}
        >
          {file ? (
            <div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(46,125,50,0.12)", color: "#2e7d32" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="font-semibold mb-0.5" style={{ color: "#1b5e20" }}>{file.name}</p>
              <p className="text-sm mb-3" style={{ color: "#6d4c41" }}>{(file.size / 1024).toFixed(0)} KB</p>
              <button
                onClick={() => setFile(null)}
                className="text-sm font-medium cursor-pointer"
                style={{ color: "#ef4444" }}
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(46,125,50,0.10)", color: "#2e7d32" }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="font-semibold mb-1" style={{ color: "#1b5e20" }}>Drag & drop your resume here</p>
              <p className="text-sm mb-5" style={{ color: "#6d4c41" }}>or click to browse files</p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-white"
                style={{ background: "#2e7d32" }}>
                Choose File
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  className="hidden"
                />
              </label>
              <p className="text-xs mt-4" style={{ color: "#a1887f" }}>PDF and DOCX supported · Max 10 MB</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl p-4 flex items-start gap-3"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>
          </div>
        )}

        {file && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-6 w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            style={{ background: uploading ? "#1b5e20" : "#2e7d32" }}
          >
            {uploading ? (
              <><Spinner /> Parsing with AI — this may take a moment</>
            ) : (
              "Upload & Parse Resume"
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- JD Mode ---------- */
function JDMode() {
  const navigate = useNavigate();
  const { currentResume, setResume } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [action, setAction] = useState<"generate" | "tailor">(currentResume ? "tailor" : "generate");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) { setError("Please paste a job description"); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/api/generate-from-jd", { job_description: jobDescription });
      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
        navigate("/editor");
      } else {
        setError("Failed to generate resume");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) { setError("Please paste a job description"); return; }
    if (!currentResume) { setError("No existing resume to tailor. Use Generate instead."); return; }
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/api/resume/create", currentResume);
      const res = await apiClient.post("/api/tailor", { resume_id: currentResume.id, job_description: jobDescription });
      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
        navigate("/editor");
      } else {
        setError("Failed to tailor resume");
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || "Tailoring failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10" style={{ background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)" }}>
      <div className="max-w-2xl mx-auto px-4">
        <BackButton onClick={() => navigate("/")} />

        <h1 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: "#1b5e20" }}>
          From Job Description
        </h1>
        <p className="mb-8 text-base" style={{ color: "#6d4c41" }}>
          Paste a job description and AI will{" "}
          {currentResume ? "tailor your existing resume or generate a new one" : "generate a resume structure"} to match it.
        </p>

        {/* Action Toggle */}
        {currentResume && (
          <div className="flex gap-1 mb-6 rounded-xl p-1" style={{ background: "rgba(46,125,50,0.08)" }}>
            {(["tailor", "generate"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAction(a)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                style={{
                  background: action === a ? "#ffffff" : "transparent",
                  color: action === a ? "#2e7d32" : "#6d4c41",
                  boxShadow: action === a ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {a === "tailor" ? "Tailor Existing Resume" : "Generate New Resume"}
              </button>
            ))}
          </div>
        )}

        {/* Job Description Input */}
        <div className="rounded-2xl p-6"
          style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(153,246,228,0.50)", boxShadow: "0 2px 16px rgba(13,148,136,0.06)" }}>
          <label className="block text-sm font-semibold mb-2" style={{ color: "#1b5e20" }}>
            Job Description
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => { setJobDescription(e.target.value); if (error) setError(null); }}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none outline-none"
            style={{
              border: "1.5px solid #e0d6c9",
              color: "#1e293b",
              background: "#f8f5f0",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
            onFocus={(e) => { e.target.style.borderColor = "#2e7d32"; e.target.style.boxShadow = "0 0 0 3px rgba(46,125,50,0.12)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e0d6c9"; e.target.style.boxShadow = "none"; }}
            rows={12}
            placeholder="Paste the full job description here..."
          />
          <p className="text-xs mt-2" style={{ color: "#a1887f" }}>
            Include title, requirements, qualifications, and responsibilities for best results.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl p-4 flex items-start gap-3"
            style={{ background: "#fef2f2", border: "1px solid #fecaca" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-sm" style={{ color: "#b91c1c" }}>{error}</p>
          </div>
        )}

        <button
          onClick={action === "tailor" ? handleTailor : handleGenerate}
          disabled={loading || !jobDescription.trim()}
          className="mt-5 w-full py-3.5 rounded-xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          style={{ background: "#2e7d32" }}
        >
          {loading ? (
            <><Spinner />{action === "tailor" ? "Tailoring resume…" : "Generating resume…"}</>
          ) : action === "tailor" ? (
            "Tailor My Resume"
          ) : (
            "Generate Resume"
          )}
        </button>

        {action === "tailor" && currentResume && (
          <div className="mt-4 rounded-xl p-4"
            style={{ background: "rgba(13,148,136,0.06)", border: "1px solid rgba(46,125,50,0.20)" }}>
            <p className="text-sm" style={{ color: "#1b5e20" }}>
              Tailoring <strong>{currentResume.personal.name || "your resume"}</strong> to match this job description. Your original data will be preserved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
