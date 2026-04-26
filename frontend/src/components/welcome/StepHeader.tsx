import { Sparkles } from "lucide-react";

interface StepHeaderProps {
  step: number;
  total: number;
  title: string;
  subtitle: string;
}

export default function StepHeader({ step, total, title, subtitle }: StepHeaderProps) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-3 py-1.5">
        <Sparkles className="size-3.5 text-[#054d28]" />
        <span className="text-xs font-bold uppercase tracking-wider">
          Step {step} of {total}
        </span>
      </div>
      <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.05] text-foreground">
        {title}
      </h1>
      <p className="mt-4 max-w-xl text-base text-muted-foreground">{subtitle}</p>
      <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
