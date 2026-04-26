import { Star } from "lucide-react";
import { FadeInUp } from "@/components/motion";

type Quote = {
  name: string;
  role: string;
  initials: string;
  quote: string;
};

const QUOTES_ROW_1: Quote[] = [
  {
    name: "Priya Patel",
    role: "Senior SWE @ Stripe",
    initials: "PP",
    quote:
      "I uploaded my old resume, took the AI suggestions, and landed 3 interviews the same week. The bullets finally sound like a senior engineer.",
  },
  {
    name: "Marcus Liu",
    role: "Data Scientist @ Airbnb",
    initials: "ML",
    quote:
      "The ATS scoring showed exactly which keywords I was missing from the JD. Went from 62% match to 94% in ten minutes.",
  },
  {
    name: "Sara Okafor",
    role: "PM @ Notion",
    initials: "SO",
    quote:
      "Tailoring to a specific JD used to take me a full evening. Now it takes one click and the result is better than what I wrote by hand.",
  },
];

const QUOTES_ROW_2: Quote[] = [
  {
    name: "David Kim",
    role: "New grad @ Google",
    initials: "DK",
    quote:
      "As a new grad I had no idea how to quantify my projects. The AI turned my bullet points into something a senior recruiter would actually read.",
  },
  {
    name: "Alessia Romano",
    role: "UX Designer @ Figma",
    initials: "AR",
    quote:
      "The Deedy template is gorgeous and the LaTeX output is crisp. I replaced my Canva resume and got twice the callbacks.",
  },
  {
    name: "Jamal Thompson",
    role: "Career Coach",
    initials: "JT",
    quote:
      "I use this with every one of my clients now. The 6-step form + AI enhance cut my review time in half.",
  },
];

function QuoteCard({ q }: { q: Quote }) {
  return (
    <div className="shadow-ring flex w-[360px] flex-shrink-0 flex-col rounded-[24px] bg-card p-6 md:w-[420px]">
      <div className="mb-4 flex items-center gap-0.5 text-primary">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="size-4 fill-current" />
        ))}
      </div>
      <p className="mb-6 text-base leading-relaxed text-foreground">
        &ldquo;{q.quote}&rdquo;
      </p>
      <div className="mt-auto flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-[#163300]">
          {q.initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{q.name}</p>
          <p className="text-xs text-muted-foreground">{q.role}</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInUp className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#054d28]">
            Testimonials
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Loved by job seekers
            <br />
            at top companies.
          </h2>
        </FadeInUp>
      </div>

      <div className="marquee-paused relative mt-16 space-y-5">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />
        <div className="animate-marquee flex w-max gap-5">
          {[...QUOTES_ROW_1, ...QUOTES_ROW_1].map((q, i) => (
            <QuoteCard key={`r1-${i}`} q={q} />
          ))}
        </div>
        <div className="animate-marquee-reverse flex w-max gap-5">
          {[...QUOTES_ROW_2, ...QUOTES_ROW_2].map((q, i) => (
            <QuoteCard key={`r2-${i}`} q={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
