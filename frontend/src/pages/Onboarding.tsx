import { Link } from "react-router-dom";
import { Upload, FilePlus2, Target, Sparkles } from "lucide-react";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const cards = [
    {
      to: "/create?mode=upload",
      icon: Upload,
      title: "Upload resume",
      description:
        "Drop your existing PDF or DOCX — AI parses it into an editable format.",
      recommended: true,
    },
    {
      to: "/create?mode=form",
      icon: FilePlus2,
      title: "Start from scratch",
      description: "Fill in a guided 6-step form to build your resume.",
    },
    {
      to: "/create?mode=jd",
      icon: Target,
      title: "From job description",
      description: "Paste a JD — we'll generate a tailored resume for it.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[500px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(159,232,112,0.6) 0%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <FadeInUp className="mb-12 text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[rgba(14,15,12,0.12)] bg-card px-3 py-1.5">
            <Sparkles className="size-3.5 text-[#054d28]" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Welcome
            </span>
          </div>
          <h1 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Let's build your
            <br />
            first resume.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground">
            Upload an existing resume to get started fastest — or pick another
            option below.
          </p>
        </FadeInUp>

        <Stagger className="grid gap-5 md:grid-cols-3">
          {cards.map(({ to, icon: Icon, title, description, recommended }) => (
            <StaggerItem key={to}>
              <Link
                to={to}
                className={cn(
                  "relative flex h-full flex-col rounded-[30px] bg-card p-7 no-underline transition-transform hover:-translate-y-1",
                  recommended
                    ? "ring-2 ring-primary"
                    : "shadow-ring",
                )}
              >
                {recommended && (
                  <div className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                    Recommended
                  </div>
                )}
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-secondary text-[#054d28]">
                  <Icon className="size-5" strokeWidth={2.2} />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </div>
  );
}
