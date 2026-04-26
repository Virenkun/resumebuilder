import { Link } from "react-router-dom";
import { FileCheck2, Github, Twitter, Linkedin } from "lucide-react";
import { BRAND } from "@/constants/brand";

const LINKS = {
  Product: [
    { label: "Features", href: "#why" },
    { label: "Pricing", href: "#pricing" },
    { label: "Templates", href: "/templates" },
    { label: "Changelog", href: "#" },
  ],
  Resources: [
    { label: "ATS guide", href: "#" },
    { label: "Resume tips", href: "#" },
    { label: "Help center", href: "#" },
    { label: "API docs", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookies", href: "#" },
    { label: "Security", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(14,15,12,0.08)] bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <FileCheck2 className="size-4" />
              </div>
              <span className="font-display text-xl text-foreground">
                {BRAND.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              {BRAND.tagline}
            </p>
            <div className="mt-6 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="flex size-9 items-center justify-center rounded-full bg-muted text-foreground/70 hover:bg-secondary hover:text-[#163300]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground no-underline hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[rgba(14,15,12,0.08)] pt-8 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Claude · Compiled with Tectonic LaTeX
          </p>
        </div>
      </div>
    </footer>
  );
}
