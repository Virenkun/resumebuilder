import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { FadeInUp } from "@/components/motion";
import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section className="relative px-6 py-20">
      <FadeInUp>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-foreground px-8 py-20 text-center md:px-16 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -top-20 size-[320px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(159,232,112,0.8) 0%, transparent 70%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-20 size-[320px] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(205,255,173,0.9) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] text-background">
              Your next role
              <br />
              <span className="bg-primary px-3 text-primary-foreground">
                starts here.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-background/70">
              Build a resume that lands interviews in under a minute. Free
              forever plan, no credit card.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="xl">
                <Link to="/signup">
                  Build your resume <ArrowRight className="size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
