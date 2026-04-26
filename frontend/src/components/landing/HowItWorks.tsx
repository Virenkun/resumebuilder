import { Upload, Wand2, Download } from "lucide-react";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";

const STEPS = [
  {
    n: "01",
    icon: Upload,
    title: "Upload or start blank",
    body: "Drop an existing PDF / DOCX and we parse it into a structured resume, or start from a 6-step guided form.",
  },
  {
    n: "02",
    icon: Wand2,
    title: "Let AI enhance it",
    body: "Claude rewrites bullets with strong verbs and quantified impact, tailors to any job description, and scores for ATS.",
  },
  {
    n: "03",
    icon: Download,
    title: "Export pristine PDF",
    body: "Pick one of 5 LaTeX templates. We compile with Tectonic and hand back a pixel-perfect, ATS-safe PDF.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInUp className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#054d28]">
            How it works
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Three steps.
            <br />
            One great resume.
          </h2>
        </FadeInUp>

        <Stagger className="mt-16 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <StaggerItem key={n}>
              <div className="shadow-ring group relative h-full rounded-[30px] bg-card p-8 transition-transform hover:-translate-y-1">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <Icon className="size-6" strokeWidth={2.2} />
                  </div>
                  <span className="font-display text-4xl text-foreground/10">
                    {n}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
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
