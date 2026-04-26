import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FadeInUp, Stagger, StaggerItem } from "@/components/motion";
import { cn } from "@/lib/utils";

type Tier = {
  name: string;
  description: string;
  monthly: number;
  yearly: number;
  highlight?: boolean;
  cta: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Free",
    description: "For the occasional job hunt.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: [
      "1 resume",
      "AI bullet enhancement (10/mo)",
      "All 5 templates",
      "PDF export",
    ],
  },
  {
    name: "Pro",
    description: "Everything you need for an active search.",
    monthly: 12,
    yearly: 108,
    highlight: true,
    cta: "Go Pro",
    features: [
      "Unlimited resumes",
      "Unlimited AI enhancements",
      "Tailor to any job description",
      "ATS scoring + keyword diff",
      "Priority PDF generation",
    ],
  },
  {
    name: "Team",
    description: "For career coaches & bootcamps.",
    monthly: 39,
    yearly: 348,
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "5 seats included",
      "Shared template library",
      "Branded exports",
      "Priority support",
    ],
  },
];

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <FadeInUp className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#054d28]">
            Pricing
          </p>
          <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] text-foreground">
            Simple, honest
            <br />
            pricing.
          </h2>

          <div className="mt-10 inline-flex items-center gap-1 rounded-full border border-[rgba(14,15,12,0.12)] bg-background p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                !yearly
                  ? "bg-foreground text-background"
                  : "text-muted-foreground",
              )}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                yearly
                  ? "bg-foreground text-background"
                  : "text-muted-foreground",
              )}
            >
              Yearly
              <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                -25%
              </span>
            </button>
          </div>
        </FadeInUp>

        <Stagger className="mt-16 grid gap-5 md:grid-cols-3">
          {TIERS.map((tier) => (
            <StaggerItem key={tier.name}>
              <div
                className={cn(
                  "relative h-full rounded-[30px] p-8 transition-transform hover:-translate-y-1",
                  tier.highlight
                    ? "bg-foreground text-background ring-2 ring-primary"
                    : "shadow-ring bg-card text-foreground",
                )}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </div>
                )}
                <h3
                  className={cn(
                    "font-display text-3xl",
                    tier.highlight ? "text-background" : "text-foreground",
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm",
                    tier.highlight
                      ? "text-background/70"
                      : "text-muted-foreground",
                  )}
                >
                  {tier.description}
                </p>

                <div className="mt-8 flex items-baseline gap-1">
                  <span
                    className={cn(
                      "font-display text-6xl",
                      tier.highlight ? "text-background" : "text-foreground",
                    )}
                  >
                    ${yearly ? Math.round(tier.yearly / 12) : tier.monthly}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      tier.highlight
                        ? "text-background/70"
                        : "text-muted-foreground",
                    )}
                  >
                    /mo
                  </span>
                </div>
                {yearly && tier.yearly > 0 && (
                  <p
                    className={cn(
                      "mt-1 text-xs",
                      tier.highlight
                        ? "text-background/60"
                        : "text-muted-foreground",
                    )}
                  >
                    ${tier.yearly} billed yearly
                  </p>
                )}

                <Button
                  asChild
                  className="mt-8 w-full"
                  variant={tier.highlight ? "default" : "subtle"}
                  size="lg"
                >
                  <Link to="/signup">{tier.cta}</Link>
                </Button>

                <ul className="mt-8 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          "mt-0.5 size-4 flex-shrink-0",
                          tier.highlight ? "text-primary" : "text-[#054d28]",
                        )}
                        strokeWidth={3}
                      />
                      <span
                        className={cn(
                          tier.highlight
                            ? "text-background/90"
                            : "text-foreground/80",
                        )}
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
