import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";
import { EditTab } from "../components/editor/tabs/EditTab";
import { ScoreTab } from "../components/editor/tabs/ScoreTab";
import { TemplateSidebar } from "../components/editor/sidebar/TemplateSidebar";
import { TemplatePreviewModal } from "../components/editor/templates/TemplatePreviewModal";

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
}

export default function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentResume, updateResume, setError, error } = useResumeStore();
  const [selectedTemplate, setSelectedTemplate] = useState("jakes_resume");
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [compileStatus, setCompileStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "score">("edit");
  const [scoreData, setScoreData] = useState<any>(null);
  const [scoring, setScoring] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  useEffect(() => {
    // Load templates list
    apiClient
      .get("/api/templates")
      .then((res) => {
        if (res.data.templates) {
          setTemplates(res.data.templates);
        }
      })
      .catch(() => {
        // Fallback templates
        setTemplates([
          {
            id: "jakes_resume",
            name: "Jake's Resume",
            description: "Clean single-column, ATS-optimized.",
          },
          {
            id: "modern",
            name: "Modern",
            description: "Blue accent color, contemporary feel.",
          },
          {
            id: "classic",
            name: "Classic",
            description: "Traditional serif font, academic style.",
          },
          {
            id: "minimal",
            name: "Minimal",
            description: "Ultra-clean sans-serif, generous whitespace.",
          },
        ]);
      });
  }, []);

  useEffect(() => {
    if (id && !currentResume) {
      apiClient
        .get(`/api/resume/${id}`)
        .then((res) => {
          if (res.data.resume) {
            useResumeStore.getState().setResume(res.data.resume);
          }
        })
        .catch(() => setError("Failed to load resume"));
    }
  }, [id]);

  if (!currentResume) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)",
        }}
      >
        <div className="text-center">
          <p className="mb-4 text-base" style={{ color: "#6d4c41" }}>
            No resume data found.
          </p>
          <button
            onClick={() => navigate("/create?mode=form")}
            className="px-6 py-2.5 rounded-xl text-white font-semibold cursor-pointer"
            style={{ background: "#2e7d32" }}
          >
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  const handleCompile = async () => {
    setCompileStatus("compiling");
    setError(null);
    try {
      // First save the resume
      await apiClient.post("/api/resume/create", currentResume);

      // Then compile
      const res = await apiClient.post("/api/compile", {
        resume_id: currentResume.id,
        template: selectedTemplate,
      });

      if (res.data.success) {
        setCompileStatus("success");
        navigate(`/preview/${currentResume.id}`);
      } else {
        setCompileStatus("latex_only");
        setError(res.data.message);
      }
    } catch (err: any) {
      setCompileStatus("error");
      setError(err.response?.data?.detail || "Compilation failed");
    }
  };

  const handleScore = async () => {
    setScoring(true);
    setError(null);
    try {
      // Save first
      await apiClient.post("/api/resume/create", currentResume);

      const res = await apiClient.post("/api/score", {
        resume_id: currentResume.id,
        job_description: jobDescription || null,
      });

      setScoreData(res.data);
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map((d: any) => d.msg).join("; ")
        : detail || "Scoring failed";
      setError(msg);
    } finally {
      setScoring(false);
    }
  };

  const handleDownloadLatex = async () => {
    try {
      // Save and compile first to generate .tex
      await apiClient.post("/api/resume/create", currentResume);
      await apiClient.post("/api/compile", {
        resume_id: currentResume.id,
        template: selectedTemplate,
      });

      window.open(
        `${apiClient.defaults.baseURL}/api/download/latex/${currentResume.id}`,
        "_blank",
      );
    } catch (err: any) {
      setError("Failed to generate LaTeX file");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 100%)",
      }}
    >
      {/* Fixed Header */}
      <div
        style={{
          flexShrink: 0,
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.90)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(153,246,228,0.40)",
          boxShadow: "0 1px 12px rgba(46,125,50,0.08)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div>
            <h1
              className="text-xl font-extrabold tracking-tight"
              style={{ color: "#1b5e20" }}
            >
              Resume Editor
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "#6d4c41" }}>
              {currentResume.personal.name || "Untitled Resume"}
            </p>
          </div>

          {/* Compact stats strip */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: "Exp", value: currentResume.experience.length },
              { label: "Edu", value: currentResume.education.length },
              { label: "Skills", value: Object.values(currentResume.skills).flat().length },
              { label: "Projects", value: currentResume.projects.length },
              ...(scoreData
                ? [{ label: "ATS", value: `${scoreData.score}/100`, highlight: true, score: scoreData.score }]
                : []),
            ].map((stat: any) => (
              <div
                key={stat.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: "rgba(13,148,136,0.06)", border: "1px solid rgba(153,246,228,0.5)" }}
              >
                <span className="text-xs" style={{ color: "#6d4c41" }}>{stat.label}</span>
                <span
                  className="text-xs font-bold"
                  style={{
                    color: stat.highlight
                      ? stat.score >= 80 ? "#16a34a" : stat.score >= 60 ? "#ca8a04" : "#dc2626"
                      : "#2e7d32",
                  }}
                >
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={handleDownloadLatex}
              className="px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
              style={{
                border: "1.5px solid #e0d6c9",
                color: "#475569",
                background: "white",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f8f5f0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "white";
              }}
            >
              Download .tex
            </button>
            <button
              onClick={handleCompile}
              disabled={compileStatus === "compiling"}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
              style={{ background: "#2e7d32" }}
            >
              {compileStatus === "compiling"
                ? "Compiling…"
                : "Compile & Preview PDF"}
            </button>
          </div>
        </div>

        {/* Error Banner inside header area */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 pb-3">
            <div
              className="rounded-xl p-3 flex justify-between items-center"
              style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
            >
              <p className="text-sm" style={{ color: "#b91c1c" }}>
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-sm font-medium cursor-pointer"
                style={{ color: "#ef4444" }}
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scrollable body — each column scrolls independently */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "0 1rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "1.5rem",
          }}
        >
          {/* Left: Tabs + Resume Sections (2 cols wide) */}
          <div
            className="editor-scroll"
            style={{
              gridColumn: "span 2",
              overflowY: "auto",
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
              paddingRight: "0.5rem",
            }}
          >
            {/* Tabs */}
            <div
              className="flex gap-1 mb-6 rounded-xl p-1 w-fit"
              style={{ background: "rgba(46,125,50,0.08)" }}
            >
              {(["edit", "score"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer"
                  style={{
                    background: activeTab === tab ? "#ffffff" : "transparent",
                    color: activeTab === tab ? "#2e7d32" : "#6d4c41",
                    boxShadow:
                      activeTab === tab
                        ? "0 1px 4px rgba(0,0,0,0.08)"
                        : "none",
                  }}
                >
                  {tab === "edit" ? "Edit Resume" : "ATS Score"}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {activeTab === "edit" && (
                <EditTab resume={currentResume} updateResume={updateResume} />
              )}
              {activeTab === "score" && (
                <ScoreTab
                  scoreData={scoreData}
                  scoring={scoring}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  onScore={handleScore}
                />
              )}
            </div>
          </div>

          {/* Right: Templates + Stats (1 col, independent scroll) */}
          <div
            className="editor-scroll"
            style={{
              overflowY: "auto",
              paddingTop: "1.5rem",
              paddingBottom: "1.5rem",
            }}
          >
            <TemplateSidebar
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelect={setSelectedTemplate}
              previewTemplate={previewTemplate}
              onTogglePreview={(id) =>
                setPreviewTemplate(previewTemplate === id ? null : id)
              }
            />

            {previewTemplate && (
              <TemplatePreviewModal
                templateId={previewTemplate}
                onClose={() => setPreviewTemplate(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
