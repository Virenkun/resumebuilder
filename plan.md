Here's a comprehensive plan for your AI-powered Resume Builder app.Here's the full plan broken into phases:

---

**Phase 1 — Input modes**

You'll have three core entry points. The "old resume" mode accepts a PDF or DOCX, which gets parsed by Claude to extract structured data (name, experience, education, skills, etc.). The "fill by info" mode is a guided multi-step form where the user fills in sections manually. The "fill by JD" mode takes a job description and either generates a starter resume from scratch or re-tailors an existing one to match it.

---

**Phase 2 — AI processing pipeline**

Each input flows through Claude to do four things: parse and normalize the raw data into a structured schema, rewrite bullet points with stronger action verbs and quantified impact, align keywords to the target JD, and score the result against ATS (Applicant Tracking System) patterns with specific improvement suggestions.

---

**Phase 3 — LaTeX template engine**

This is the differentiator. You maintain a library of LaTeX templates (e.g. Jake's Resume, Awesome-CV, moderncv). When the user picks a template, the structured data from the AI pipeline gets injected into the `.tex` file as variables. You then compile it server-side using a tool like `pdflatex` or `tectonic` and return the PDF. You can host this compilation on a small backend (Node/Python) or use a cloud function.

---

**Phase 4 — Output & editor**

Users get a live PDF preview, the raw LaTeX source they can download and edit, the compiled PDF, and an ATS match report with a score and actionable feedback.

---

**Tech stack recommendation**

| Layer         | Choice                                    |
| ------------- | ----------------------------------------- |
| Frontend      | React + Tailwind                          |
| AI            | Claude API (claude-sonnet-4-6)            |
| LaTeX compile | Python + `tectonic` in a Docker container |
| PDF preview   | `react-pdf` or iframe                     |
| Storage       | S3 / Cloudflare R2 for generated files    |
| Backend       | FastAPI or Next.js API routes             |

---

**Phase 5 — Stretch features**

Once the core works, you can add: version history, multiple resume variants per job application, a cover letter generator from the same data, and a LinkedIn profile optimizer that uses the same structured data.

Want me to go deeper on any specific part — like the LaTeX template injection logic, the Claude prompts for parsing/rewriting, or the frontend flow?
