import { cn } from "@/lib/utils";

export function StatsSidebar({
  resume,
  scoreData,
}: {
  resume: any;
  scoreData: any;
}) {
  return (
    <div className="shadow-ring rounded-3xl bg-card p-5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-[#054d28]">
        Resume stats
      </h3>
      <div className="space-y-2 text-sm">
        <Row label="Experience entries" value={resume.experience.length} />
        <Row label="Education entries" value={resume.education.length} />
        <Row
          label="Total skills"
          value={Object.values(resume.skills).flat().length}
        />
        <Row label="Projects" value={resume.projects.length} />
        {scoreData && (
          <div className="flex justify-between border-t border-[rgba(14,15,12,0.08)] pt-2">
            <span className="text-muted-foreground">ATS score</span>
            <span
              className={cn(
                "font-bold",
                scoreData.score >= 80
                  ? "text-[#054d28]"
                  : scoreData.score >= 60
                    ? "text-[#a56b00]"
                    : "text-destructive",
              )}
            >
              {scoreData.score}/100
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}
