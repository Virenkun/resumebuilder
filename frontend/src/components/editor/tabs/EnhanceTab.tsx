import { Loader2, Sparkles } from "lucide-react";

export function EnhanceTab({
  resume,
  enhancingIndex,
  onEnhance,
}: {
  resume: any;
  enhancingIndex: number | null;
  onEnhance: (idx: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-3xl border border-primary/40 bg-secondary/40 p-4">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-[#054d28]" />
        <p className="text-sm text-[#054d28]">
          <strong className="font-bold">AI enhancement</strong> rewrites your
          bullets with stronger action verbs, quantified impact, and the STAR
          method. Click "Enhance" on any experience to improve it.
        </p>
      </div>

      {resume.experience.length === 0 ? (
        <div className="shadow-ring rounded-3xl bg-card p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No experience entries to enhance. Add experience first.
          </p>
        </div>
      ) : (
        resume.experience.map((exp: any, idx: number) => (
          <div key={exp.id} className="shadow-ring rounded-3xl bg-card p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{exp.position}</h4>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <button
                onClick={() => onEnhance(idx)}
                disabled={enhancingIndex !== null}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-bold text-[#163300] transition-transform hover:scale-[1.05] active:scale-[0.95] disabled:scale-100 disabled:opacity-50"
              >
                {enhancingIndex === idx ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Enhancing…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Enhance
                  </>
                )}
              </button>
            </div>
            <ul className="space-y-2">
              {exp.bullets.map((bullet: string, bIdx: number) => (
                <li
                  key={bIdx}
                  className="relative pl-4 text-sm text-foreground"
                >
                  <span className="absolute left-0 text-[#054d28]">–</span>
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
