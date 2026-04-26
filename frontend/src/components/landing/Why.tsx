import {
  Sparkles,
  Target,
  ShieldCheck,
  LayoutTemplate,
  FileCheck2,
  Gauge,
} from "lucide-react";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Bullet Enhancement",
    body: "Rewrite every bullet with stronger action verbs and quantified impact — powered by Claude.",
  },
  {
    icon: Target,
    title: "Tailor to any job",
    body: "Paste a job description and get a resume tuned to its keywords and requirements.",
  },
  {
    icon: ShieldCheck,
    title: "ATS-safe output",
    body: "Every template parses cleanly through Workday, Greenhouse, Lever and every other ATS.",
  },
  {
    icon: LayoutTemplate,
    title: "5 polished templates",
    body: "Jake's, Modern, Classic, Minimal, Deedy — all compile to pixel-perfect PDFs via Tectonic.",
  },
  {
    icon: FileCheck2,
    title: "Upload or build",
    body: "Drop an existing PDF / DOCX and we parse it, or start from a guided 6-step form.",
  },
  {
    icon: Gauge,
    title: "ATS score & keywords",
    body: "See exactly which keywords you're missing and how a recruiter will parse your resume.",
  },
];

export function Why() {
  return (
    <section id="why" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInUp className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#054d28]">
            Why this works
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Everything you need to
            <br />
            <span className="bg-primary px-3 leading-none">get hired.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Built on Claude — the best AI for writing — and compiled with
            production LaTeX. No compromises on quality.
          </p>
        </FadeInUp>

        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="shadow-ring h-full rounded-[30px] bg-card p-8 transition-transform hover:-translate-y-1">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-[#054d28]">
                  <Icon className="size-5" strokeWidth={2.2} />
                </div>
                <h3 className="mb-2.5 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-[15px] leading-relaxed text-muted-foreground">
                  {body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
