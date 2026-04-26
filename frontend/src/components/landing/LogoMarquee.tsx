const LOGOS = [
  "Workday",
  "Greenhouse",
  "Lever",
  "Ashby",
  "Taleo",
  "SmartRecruiters",
  "iCIMS",
  "BambooHR",
];

export function LogoMarquee() {
  return (
    <section className="border-y border-[rgba(14,15,12,0.08)] bg-background/60 py-10">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Parses cleanly by every major ATS
      </p>
      <div className="marquee-paused relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />
        <div className="animate-marquee flex w-max gap-14 whitespace-nowrap">
          {[...LOGOS, ...LOGOS].map((logo, i) => (
            <span
              key={`${logo}-${i}`}
              className="font-display text-2xl text-foreground/50 md:text-3xl"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
