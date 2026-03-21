import { Link } from "react-router-dom";
import StarSearchIcon from "../components/icons/start-search-icon";

function UploadIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

const OPTIONS = [
  {
    to: "/create?mode=upload",
    icon: <UploadIcon />,
    title: "Upload Resume",
    description:
      "Upload your existing PDF or DOCX — AI parses and enhances it instantly.",
    badge: "Most Popular",
  },
  {
    to: "/create?mode=form",
    icon: <FormIcon />,
    title: "Fill by Info",
    description:
      "Build from scratch with our guided 6-step form. No prior resume needed.",
    badge: null,
  },
  {
    to: "/create?mode=jd",
    icon: <TargetIcon />,
    title: "From Job Description",
    description:
      "Paste a job posting — AI tailors or generates a resume that matches it.",
    badge: "AI-Powered",
  },
];

const FEATURES = [
  { label: "ATS Optimization" },
  { label: "AI Bullet Enhancement" },
  { label: "5 LaTeX Templates" },
  { label: "PDF Export" },
];

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #f8f5f0 0%, #e8f5e9 50%, #f8f5f0 100%)",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute -top-30 -left-30 w-120 h-120 rounded-full opacity-30 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #4caf50 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-90 h-90 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)",
        }}
      />

      <div className="max-w-4xl mx-auto px-4 py-16 text-center relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wide"
          style={{
            background: "rgba(46,125,50,0.10)",
            color: "#2e7d32",
            border: "1px solid rgba(46,125,50,0.20)",
          }}
        >
          <StarSearchIcon />
          Powered by Claude AI
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-5 leading-tight tracking-tight"
          style={{ color: "#1b5e20" }}
        >
          AI Resume
          <span className="block" style={{ color: "#2e7d32" }}>
            Builder
          </span>
        </h1>

        <p
          className="text-lg text-slate-500 mb-14 max-w-xl mx-auto leading-relaxed"
          style={{ fontWeight: 400 }}
        >
          Create professional, ATS-optimized resumes with AI-powered
          enhancements and beautiful LaTeX templates.
        </p>

        {/* Option Cards */}
        <div className="grid md:grid-cols-3 gap-5 text-left">
          {OPTIONS.map((opt) => (
            <Link
              key={opt.to}
              to={opt.to}
              className="group relative rounded-2xl p-6 flex flex-col gap-4 cursor-pointer no-underline"
              style={{
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.55)",
                boxShadow:
                  "0 4px 24px rgba(46,125,50,0.08), 0 1px 4px rgba(0,0,0,0.06)",
                transition: "box-shadow 200ms ease, transform 200ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 8px 40px rgba(13,148,136,0.18), 0 2px 8px rgba(0,0,0,0.08)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow =
                  "0 4px 24px rgba(46,125,50,0.08), 0 1px 4px rgba(0,0,0,0.06)";
                (e.currentTarget as HTMLElement).style.transform =
                  "translateY(0)";
              }}
            >
              {/* Optional badge */}
              {opt.badge && (
                <span
                  className="absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(46,125,50,0.12)",
                    color: "#2e7d32",
                  }}
                >
                  {opt.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "rgba(46,125,50,0.10)",
                  color: "#2e7d32",
                }}
              >
                {opt.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h2
                  className="text-base font-bold mb-1.5"
                  style={{ color: "#1b5e20" }}
                >
                  {opt.title}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#6d4c41" }}
                >
                  {opt.description}
                </p>
              </div>

              {/* Arrow */}
              <div
                className="flex items-center gap-1 text-xs font-semibold mt-1 shrink-0"
                style={{ color: "#2e7d32" }}
              >
                Get started
                <span className="group-hover:translate-x-1 transition-transform duration-150">
                  <ChevronRightIcon />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Feature strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {FEATURES.map((f, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-sm"
              style={{ color: "#6d4c41" }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#2e7d32"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {f.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
