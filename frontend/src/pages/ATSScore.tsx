import { useEffect, useState } from "react";
import { AlertCircle, AlertTriangle, Check, Gauge, Loader2, Sparkles } from "lucide-react";
import apiClient from "../services/apiClient";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FadeInUp } from "@/components/motion";
import { cn } from "@/lib/utils";

interface ResumeListItem {
  id: string;
  name: string;
}

interface ScoreResponse {
  score: number;
  keyword_match?: number | null;
  issues: {
    critical: string[];
    recommended: string[];
    optional: string[];
  };
  suggestions: string[];
}

export default function ATSScore() {
  const [resumes, setResumes] = useState<ResumeListItem[] | null>(null);
  const [resumeId, setResumeId] = useState<string>("");
  const [jd, setJd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResponse | null>(null);

  useEffect(() => {
    apiClient
      .get<{ resumes: ResumeListItem[] }>("/api/resumes")
      .then((res) => {
        const list = res.data.resumes ?? [];
        setResumes(list);
        if (list.length > 0) setResumeId(list[0].id);
      })
      .catch(() => {
        setResumes([]);
        setError("Failed to load resumes.");
      });
  }, []);

  const handleScore = async () => {
    if (!resumeId) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiClient.post<ScoreResponse>("/api/score", {
        resume_id: resumeId,
        job_description: jd || null,
      });
      setResult(res.data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Scoring failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-8">
      <FadeInUp>
        <h1 className="font-display text-5xl text-foreground">ATS score</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Check how well your resume clears Applicant Tracking Systems. Paste a
          job description for keyword-matching feedback.
        </p>
      </FadeInUp>

      <div className="shadow-ring mb-6 rounded-3xl bg-card p-6">
        <div className="space-y-1.5">
          <Label>Resume</Label>
          <Select value={resumeId} onValueChange={setResumeId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a resume" />
            </SelectTrigger>
            <SelectContent>
              {resumes === null && (
                <SelectItem value="loading" disabled>
                  Loading…
                </SelectItem>
              )}
              {resumes?.length === 0 && (
                <SelectItem value="none" disabled>
                  No resumes yet
                </SelectItem>
              )}
              {resumes?.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  {r.name || "Untitled"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5 space-y-1.5">
          <Label htmlFor="jd">Job description (optional)</Label>
          <Textarea
            id="jd"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            rows={6}
            placeholder="Paste the target job description here for keyword matching…"
            className="min-h-32 resize-none"
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        <Button
          onClick={handleScore}
          disabled={!resumeId || loading}
          className="mt-5"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Scoring…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              Score resume
            </>
          )}
        </Button>
      </div>

      {result && <ScoreResult result={result} />}
    </div>
  );
}

function ScoreResult({ result }: { result: ScoreResponse }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="shadow-ring rounded-3xl bg-gradient-to-br from-secondary to-card p-6 md:col-span-1">
        <div className="mb-2 flex items-center gap-2">
          <Gauge className="size-4 text-[#054d28]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#054d28]">
            ATS score
          </span>
        </div>
        <div className="font-display text-6xl leading-none text-foreground">
          {Math.round(result.score)}
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>
        {typeof result.keyword_match === "number" && (
          <div className="mt-3 text-xs text-muted-foreground">
            Keyword match:{" "}
            <span className="font-bold text-[#054d28]">
              {Math.round(result.keyword_match)}%
            </span>
          </div>
        )}
      </div>

      <div className="space-y-4 md:col-span-2">
        <IssueBlock
          title="Critical"
          items={result.issues.critical}
          tone="red"
          icon={<AlertTriangle className="size-3.5" />}
        />
        <IssueBlock
          title="Recommended"
          items={result.issues.recommended}
          tone="amber"
          icon={<AlertTriangle className="size-3.5" />}
        />
        <IssueBlock
          title="Suggestions"
          items={result.suggestions}
          tone="green"
          icon={<Check className="size-3.5" />}
        />
      </div>
    </div>
  );
}

function IssueBlock({
  title,
  items,
  tone,
  icon,
}: {
  title: string;
  items: string[];
  tone: "red" | "amber" | "green";
  icon: React.ReactNode;
}) {
  if (!items || items.length === 0) return null;
  const toneStyles = {
    red: "bg-destructive/10 text-destructive",
    amber: "bg-[#ffd11a]/25 text-[#754f00]",
    green: "bg-secondary text-[#054d28]",
  }[tone];
  const bullet = {
    red: "text-destructive",
    amber: "text-[#754f00]",
    green: "text-[#054d28]",
  }[tone];

  return (
    <div className="shadow-ring rounded-3xl bg-card p-5">
      <h3
        className={cn(
          "mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
          toneStyles,
        )}
      >
        {icon}
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm text-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={bullet}>•</span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
