import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, Download, FileCheck, Loader2 } from "lucide-react";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";
import { EditTab } from "../components/editor/tabs/EditTab";
import { ScoreTab } from "../components/editor/tabs/ScoreTab";
import { TemplateSidebar } from "../components/editor/sidebar/TemplateSidebar";
import { TemplatePreviewModal } from "../components/editor/templates/TemplatePreviewModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    apiClient
      .get("/api/templates")
      .then((res) => {
        if (res.data.templates) {
          setTemplates(res.data.templates);
        }
      })
      .catch(() => {
        setTemplates([
          { id: "jakes_resume", name: "Jake's Resume", description: "Clean single-column, ATS-optimized." },
          { id: "modern", name: "Modern", description: "Blue accent color, contemporary feel." },
          { id: "classic", name: "Classic", description: "Traditional serif font, academic style." },
          { id: "minimal", name: "Minimal", description: "Ultra-clean sans-serif, generous whitespace." },
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
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="mb-4 text-sm text-muted-foreground">
            No resume data found.
          </p>
          <Button onClick={() => navigate("/create?mode=form")}>
            Create resume
          </Button>
        </div>
      </div>
    );
  }

  const handleCompile = async () => {
    setCompileStatus("compiling");
    setError(null);
    try {
      await apiClient.post("/api/resume/create", currentResume);
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
      await apiClient.post("/api/resume/create", currentResume);
      await apiClient.post("/api/compile", {
        resume_id: currentResume.id,
        template: selectedTemplate,
      });
      window.open(
        `${apiClient.defaults.baseURL}/api/download/latex/${currentResume.id}`,
        "_blank",
      );
    } catch {
      setError("Failed to generate LaTeX file");
    }
  };

  const stats: Array<{ label: string; value: string | number; tone?: "score" }> = [
    { label: "Exp", value: currentResume.experience.length },
    { label: "Edu", value: currentResume.education.length },
    { label: "Skills", value: Object.values(currentResume.skills).flat().length },
    { label: "Projects", value: currentResume.projects.length },
  ];
  if (scoreData) {
    stats.push({ label: "ATS", value: `${scoreData.score}/100`, tone: "score" });
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 flex-shrink-0 border-b border-[rgba(14,15,12,0.08)] bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <div>
            <h1 className="font-display text-xl text-foreground">Resume editor</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {currentResume.personal.name || "Untitled resume"}
            </p>
          </div>

          <div className="hidden items-center gap-1.5 lg:flex">
            {stats.map((s) => (
              <div
                key={s.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <span
                  className={cn(
                    "text-xs font-bold",
                    s.tone === "score"
                      ? "text-[#054d28]"
                      : "text-foreground",
                  )}
                >
                  {s.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownloadLatex}>
              <Download className="size-4" />
              .tex
            </Button>
            <Button
              onClick={handleCompile}
              disabled={compileStatus === "compiling"}
              size="sm"
            >
              {compileStatus === "compiling" ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Compiling…
                </>
              ) : (
                <>
                  <FileCheck className="size-4" />
                  Compile & preview
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mx-auto max-w-7xl px-6 pb-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="size-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-xs font-semibold text-destructive hover:underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="mx-auto grid h-full max-w-7xl gap-6 px-4 md:grid-cols-3">
          <div className="editor-scroll col-span-2 overflow-y-auto py-6 pr-2">
            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "edit" | "score")}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="edit">Edit resume</TabsTrigger>
                <TabsTrigger value="score">
                  ATS score
                  {scoreData && (
                    <Badge variant="secondary" className="ml-2">
                      {scoreData.score}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit">
                <EditTab resume={currentResume} updateResume={updateResume} />
              </TabsContent>
              <TabsContent value="score">
                <ScoreTab
                  scoreData={scoreData}
                  scoring={scoring}
                  jobDescription={jobDescription}
                  setJobDescription={setJobDescription}
                  onScore={handleScore}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="editor-scroll overflow-y-auto py-6">
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
