import { useState, type ChangeEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Upload, Loader2 } from "lucide-react";
import { FadeInUp } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import StepHeader from "@/components/welcome/StepHeader";
import apiClient from "@/services/apiClient";
import { useUserProfile } from "@/hooks/useUserProfile";
import useResumeStore from "@/store/resumeStore";
import {
  EXPERIENCE_LEVEL_OPTIONS,
  INDUSTRY_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  type ExperienceLevel,
  type PrimaryGoal,
} from "@/types/profile";
import type { Resume } from "@/types/resume";

const TOTAL_STEPS = 3;

export default function Welcome() {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, complete } = useUserProfile();
  const setResume = useResumeStore((s) => s.setResume);

  const [step, setStep] = useState(1);
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [yearsExperience, setYearsExperience] = useState<string>("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const step1Valid = !!primaryGoal;
  const step2Valid = !!experienceLevel;
  const step3Valid =
    targetRole.trim().length > 0 && industry.trim().length > 0 && !!file;

  const onPickFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    const isDocx =
      f.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      f.name.toLowerCase().endsWith(".docx");
    if (!isPdf && !isDocx) {
      toast.error("Only PDF or DOCX files are supported");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast.error("File size must be under 10MB");
      return;
    }
    setFile(f);
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading…
        </div>
      </div>
    );
  }

  if (profile?.onboarding_completed) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFinish = async () => {
    if (!step3Valid || !file) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await apiClient.post<{ success: boolean; resume: Resume }>(
        "/api/upload/resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, timeout: 60000 },
      );
      if (!res.data.success || !res.data.resume) {
        throw new Error("Resume upload failed");
      }

      const resume = res.data.resume;
      setResume(resume);

      await complete({
        primary_goal: primaryGoal,
        experience_level: experienceLevel,
        years_experience:
          yearsExperience && experienceLevel !== "student"
            ? Number(yearsExperience)
            : null,
        target_role: targetRole.trim(),
        industry: industry.trim(),
        onboarding_resume_id: resume.id,
      });

      toast.success("You're all set — let's polish your resume.");
      navigate(`/editor/${resume.id}`, { replace: true });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[500px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(159,232,112,0.6) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-2xl">
        {step === 1 && (
          <FadeInUp>
            <StepHeader
              step={1}
              total={TOTAL_STEPS}
              title="What's your next move?"
              subtitle="Pick the one that describes where you are right now. We'll tune the suggestions to match."
            />
            <div className="grid gap-3">
              {PRIMARY_GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPrimaryGoal(opt.value)}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border bg-card p-5 text-left transition",
                    primaryGoal === opt.value
                      ? "border-primary ring-2 ring-primary/40"
                      : "border-[rgba(14,15,12,0.08)] hover:border-primary/40",
                  )}
                >
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">{opt.label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {opt.description}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "mt-1 size-4 shrink-0 rounded-full border-2",
                      primaryGoal === opt.value
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </FadeInUp>
        )}

        {step === 2 && (
          <FadeInUp>
            <StepHeader
              step={2}
              total={TOTAL_STEPS}
              title="Where are you in your career?"
              subtitle="This helps us calibrate tone, seniority cues, and what bullets to surface."
            />
            <div className="space-y-8">
              <div>
                <Label className="mb-3 block text-sm font-semibold">
                  Experience level
                </Label>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {EXPERIENCE_LEVEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExperienceLevel(opt.value)}
                      className={cn(
                        "rounded-xl border px-3 py-3 text-sm font-semibold transition",
                        experienceLevel === opt.value
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-[rgba(14,15,12,0.08)] bg-card text-muted-foreground hover:border-primary/40",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {experienceLevel && experienceLevel !== "student" && (
                <div>
                  <Label htmlFor="years" className="mb-3 block text-sm font-semibold">
                    Years of experience (optional)
                  </Label>
                  <Input
                    id="years"
                    type="number"
                    min={0}
                    max={60}
                    placeholder="e.g. 5"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                    className="max-w-[180px]"
                  />
                </div>
              )}
            </div>
          </FadeInUp>
        )}

        {step === 3 && (
          <FadeInUp>
            <StepHeader
              step={3}
              total={TOTAL_STEPS}
              title="What are you aiming for?"
              subtitle="Tell us the role, industry, and upload your current resume so we can start personalizing."
            />
            <div className="space-y-6">
              <div>
                <Label htmlFor="role" className="mb-2 block text-sm font-semibold">
                  Target role
                </Label>
                <Input
                  id="role"
                  placeholder="e.g. Senior Backend Engineer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2 block text-sm font-semibold">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRY_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-2 block text-sm font-semibold">
                  Upload your current resume
                </Label>
                <label
                  htmlFor="resume-upload"
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 border-dashed bg-card p-5 transition",
                    file
                      ? "border-primary"
                      : "border-[rgba(14,15,12,0.12)] hover:border-primary/60",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-secondary text-[#054d28]">
                      <Upload className="size-4" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">
                        {file ? file.name : "Choose a PDF or DOCX"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Max 10MB — we'll parse it with AI.
                      </div>
                    </div>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="sr-only"
                    onChange={onPickFile}
                  />
                </label>
              </div>
            </div>
          </FadeInUp>
        )}

        <div className="mt-10 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={back}
            disabled={step === 1 || submitting}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>

          {step < TOTAL_STEPS ? (
            <Button
              onClick={next}
              disabled={
                (step === 1 && !step1Valid) || (step === 2 && !step2Valid)
              }
              className="gap-2"
            >
              Continue
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!step3Valid || submitting}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Setting up…
                </>
              ) : (
                <>
                  Finish
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
