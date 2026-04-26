import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Upload, AlertCircle, Loader2 } from "lucide-react";
import ResumeForm from "../components/forms/ResumeForm";
import useResumeStore from "../store/resumeStore";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FadeInUp } from "@/components/motion";

export default function CreateResume() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "form";

  if (mode === "upload") return <UploadMode />;
  if (mode === "jd") return <JDMode />;
  return <ResumeForm />;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="size-4" />
      Back to Dashboard
    </button>
  );
}

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
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Upload failed. Please try again.";
      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <BackButton onClick={() => navigate("/dashboard")} />

        <FadeInUp>
          <h1 className="font-display text-5xl text-foreground">
            Upload resume
          </h1>
          <p className="mt-3 mb-10 text-base text-muted-foreground">
            Drop an existing PDF or DOCX and Claude parses it into structured
            data you can edit and enhance.
          </p>
        </FadeInUp>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className={cn(
            "rounded-[30px] border-2 border-dashed bg-card p-12 text-center transition-colors",
            dragOver
              ? "border-primary bg-secondary/40"
              : file
                ? "border-primary/60"
                : "border-[rgba(14,15,12,0.12)]",
          )}
        >
          {file ? (
            <div>
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-5" strokeWidth={3} />
              </div>
              <p className="font-semibold text-foreground">{file.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {(file.size / 1024).toFixed(0)} KB
              </p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="mt-4 text-sm font-semibold text-destructive hover:underline"
              >
                Remove file
              </button>
            </div>
          ) : (
            <div>
              <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-secondary text-[#054d28]">
                <Upload className="size-6" strokeWidth={2} />
              </div>
              <p className="font-semibold text-foreground">
                Drag & drop your resume here
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                or click to browse files
              </p>
              <label className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.05] active:scale-[0.95]">
                Choose file
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                  className="hidden"
                />
              </label>
              <p className="mt-4 text-xs text-muted-foreground">
                PDF and DOCX supported · Max 10 MB
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {file && (
          <Button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            size="xl"
            className="mt-6 w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Parsing with AI — this may take a moment
              </>
            ) : (
              "Upload & parse resume"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function JDMode() {
  const navigate = useNavigate();
  const { currentResume, setResume } = useResumeStore();
  const [jobDescription, setJobDescription] = useState("");
  const [action, setAction] = useState<"generate" | "tailor">(
    currentResume ? "tailor" : "generate",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.post("/api/generate-from-jd", {
        job_description: jobDescription,
      });
      if (res.data.success && res.data.resume) {
        setResume(res.data.resume);
        navigate("/editor");
      } else {
        setError("Failed to generate resume");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Generation failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      setError("Please paste a job description");
      return;
    }
    if (!currentResume) {
      setError("No existing resume to tailor. Use Generate instead.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiClient.post("/api/resume/create", currentResume);
      const res = await apiClient.post("/api/tailor", {
        resume_id: currentResume.id,
        job_description: jobDescription,
      });
      if (res.data.success && res.data.resume) {
        navigate(`/tailor/${currentResume.id}`);
      } else {
        setError("Failed to tailor resume");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Tailoring failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <BackButton onClick={() => navigate("/dashboard")} />

        <FadeInUp>
          <h1 className="font-display text-5xl text-foreground">
            From job description
          </h1>
          <p className="mt-3 mb-10 text-base text-muted-foreground">
            Paste a JD and Claude will{" "}
            {currentResume
              ? "tailor your existing resume or generate a new one"
              : "generate a resume structure"}{" "}
            to match it.
          </p>
        </FadeInUp>

        {currentResume && (
          <div className="mb-6 flex gap-1 rounded-full bg-muted p-1">
            {(["tailor", "generate"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAction(a)}
                className={cn(
                  "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  action === a
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                {a === "tailor" ? "Tailor existing" : "Generate new"}
              </button>
            ))}
          </div>
        )}

        <div className="shadow-ring rounded-[24px] bg-card p-6">
          <Label htmlFor="jd" className="text-sm font-semibold text-foreground">
            Job description
          </Label>
          <Textarea
            id="jd"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (error) setError(null);
            }}
            rows={12}
            placeholder="Paste the full job description here..."
            className="mt-2 min-h-[220px] resize-none"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            Include title, requirements, qualifications, and responsibilities
            for best results.
          </p>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <AlertCircle className="mt-0.5 size-4 flex-shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={action === "tailor" ? handleTailor : handleGenerate}
          disabled={loading || !jobDescription.trim()}
          size="xl"
          className="mt-5 w-full"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {action === "tailor" ? "Tailoring resume…" : "Generating resume…"}
            </>
          ) : action === "tailor" ? (
            "Tailor my resume"
          ) : (
            "Generate resume"
          )}
        </Button>

        {action === "tailor" && currentResume && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-secondary/30 p-4">
            <p className="text-sm text-foreground">
              Tailoring{" "}
              <strong>{currentResume.personal.name || "your resume"}</strong> to
              this job description. Your original data is preserved.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
