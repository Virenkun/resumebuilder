import { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ScoreTab({
  scoreData,
  scoring,
  jobDescription,
  setJobDescription,
  onScore,
}: {
  scoreData: any;
  scoring: boolean;
  jobDescription: string;
  setJobDescription: (v: string) => void;
  onScore: () => void;
}) {
  const [scoreMode, setScoreMode] = useState<"general" | "jd">("general");

  return (
    <div className="space-y-6">
      <section className="shadow-ring rounded-3xl bg-card p-6">
        <h3 className="font-display text-2xl text-foreground">
          ATS compatibility
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Score your resume against general ATS rules or a specific job
          description.
        </p>

        <div className="mt-5 flex gap-1 rounded-full bg-muted p-1">
          {(["general", "jd"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setScoreMode(m);
                if (m === "general") setJobDescription("");
              }}
              className={cn(
                "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                scoreMode === m
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "general" ? "General ATS" : "Match to JD"}
            </button>
          ))}
        </div>

        {scoreMode === "jd" && (
          <div className="mt-5">
            <Textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
              placeholder="Paste the job description here…"
              className="min-h-32"
            />
          </div>
        )}

        <Button
          onClick={onScore}
          disabled={scoring || (scoreMode === "jd" && !jobDescription.trim())}
          size="lg"
          className="mt-5"
        >
          {scoring ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Analysing…
            </>
          ) : (
            <>
              <Sparkles className="size-4" />
              {scoreMode === "jd" ? "Score against JD" : "Analyse resume"}
            </>
          )}
        </Button>
      </section>

      {scoreData && (
        <div className="space-y-5">
          <section className="shadow-ring rounded-3xl bg-card p-6">
            <div className="flex items-center gap-6">
              <div
                className={cn(
                  "font-display text-6xl leading-none",
                  scoreData.score >= 80
                    ? "text-[#054d28]"
                    : scoreData.score >= 60
                      ? "text-[#a56b00]"
                      : "text-destructive",
                )}
              >
                {scoreData.score}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {scoreMode === "jd" ? "JD match" : "General ATS"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {scoreMode === "jd"
                    ? "Scored against the pasted job description."
                    : "General ATS compatibility across formatting and structure."}
                </p>
                {scoreData.keyword_match != null && (
                  <Badge variant="secondary" className="mt-2">
                    Keyword match {scoreData.keyword_match}%
                  </Badge>
                )}
              </div>
            </div>
          </section>

          {scoreData.issues && (
            <section className="shadow-ring rounded-3xl bg-card p-6">
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Issues
              </h4>
              <IssueGroup
                tone="critical"
                label="Critical"
                items={scoreData.issues.critical ?? []}
              />
              <IssueGroup
                tone="recommended"
                label="Recommended"
                items={scoreData.issues.recommended ?? []}
              />
              <IssueGroup
                tone="optional"
                label="Optional"
                items={scoreData.issues.optional ?? []}
              />
            </section>
          )}

          {scoreData.suggestions?.length > 0 && (
            <section className="shadow-ring rounded-3xl bg-card p-6">
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Suggestions
              </h4>
              <ul className="space-y-3">
                {scoreData.suggestions.map((s: string, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex size-6 flex-shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-[#054d28]">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function IssueGroup({
  tone,
  label,
  items,
}: {
  tone: "critical" | "recommended" | "optional";
  label: string;
  items: string[];
}) {
  if (items.length === 0) return null;

  const iconMap = {
    critical: <AlertTriangle className="size-4 text-destructive" />,
    recommended: <AlertTriangle className="size-4 text-[#a56b00]" />,
    optional: <CheckCircle2 className="size-4 text-muted-foreground" />,
  };

  const toneMap = {
    critical: "text-destructive",
    recommended: "text-[#a56b00]",
    optional: "text-muted-foreground",
  };

  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center gap-2">
        {iconMap[tone]}
        <h5 className={cn("text-xs font-bold uppercase tracking-wider", toneMap[tone])}>
          {label}
        </h5>
      </div>
      <ul className="space-y-1.5">
        {items.map((issue, i) => (
          <li key={i} className="pl-6 text-sm text-foreground">
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}
