import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
      {/* Ambient lime blob */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 size-[540px] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(159,232,112,0.55) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-80 size-[460px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(205,255,173,0.55) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(14,15,12,0.12)] bg-background/70 px-3 py-1.5 backdrop-blur"
        >
          <Sparkles className="size-3.5 text-[#054d28]" />
          <span className="text-xs font-semibold tracking-wide text-foreground">
            Get 85+ ATS Score
          </span>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.2, 0.8, 0.2, 1] }}
          className="font-display text-[clamp(3rem,9vw,7.5rem)] text-foreground"
        >
          Resumes that{" "}
          <span className="relative inline-block">
            <span className="relative z-10 text-foreground">
              land interviews
            </span>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-1 -z-0 h-[0.4em] bg-primary"
            />
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          Upload your resume or start from scratch. AI rewrites your bullets,
          tailors to any job, and exports a clean ATS-safe PDF in under a
          minute.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="xl">
            <Link to="/signup">
              Build your resume <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button asChild size="xl" variant="subtle">
            <Link to="/login">I have an account</Link>
          </Button>
        </motion.div>

        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-5 text-xs font-medium text-muted-foreground"
        >
          Free forever plan · No credit card required
        </motion.p>
      </div>

      {/* Product preview mockup */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 mx-auto mt-16 w-full max-w-5xl px-6"
      >
        <div className="shadow-ring rounded-[30px] bg-card p-3">
          <div className="rounded-[22px] bg-[#f5f5f2] p-6 md:p-10">
            <div className="mb-4 flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff6159]" />
              <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
              <span className="size-2.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="grid gap-6 md:grid-cols-[1fr_1.4fr]">
              <div className="space-y-3">
                <div className="h-7 w-40 rounded-md bg-foreground/90" />
                <div className="h-3 w-24 rounded-md bg-muted-foreground/30" />
                <div className="mt-6 space-y-1.5">
                  <div className="h-2.5 w-full rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-11/12 rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-10/12 rounded bg-muted-foreground/20" />
                </div>
                <div className="mt-6 space-y-1.5">
                  <div className="h-2.5 w-20 rounded bg-foreground/80" />
                  <div className="h-2.5 w-full rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-10/12 rounded bg-muted-foreground/20" />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 rounded bg-foreground/80" />
                  <div className="flex items-center gap-1 rounded-full bg-primary/90 px-2 py-1">
                    <Sparkles className="size-3 text-[#163300]" />
                    <span className="text-[10px] font-bold text-[#163300]">
                      AI Enhance
                    </span>
                  </div>
                </div>
                <div className="space-y-2 rounded-2xl border border-[rgba(14,15,12,0.08)] bg-white p-4">
                  <div className="h-2.5 w-full rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-11/12 rounded bg-muted-foreground/20" />
                  <div className="h-2.5 w-9/12 rounded bg-muted-foreground/20" />
                </div>
                <div className="space-y-2 rounded-2xl border border-primary/60 bg-[#f3ffe7] p-4">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="size-3 text-[#054d28]" />
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#054d28]">
                      Suggested
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded bg-[#054d28]/30" />
                  <div className="h-2.5 w-10/12 rounded bg-[#054d28]/30" />
                  <div className="h-2.5 w-11/12 rounded bg-[#054d28]/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
