# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Resume Builder — a full-stack application with a React frontend, FastAPI backend, and a Docker-based LaTeX compiler. The user uploads/creates a resume, AI (Claude) enhances it, and it compiles to PDF via LaTeX templates.

## Development Commands

### Start All Services

```bash
docker-compose up --build
```

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev        # Dev server at http://localhost:5173
npm run build      # TypeScript compile + Vite build
npm run lint       # ESLint
npm run preview    # Preview production build
```

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Environment Setup

Copy `.env.example` to `.env` and fill in:

- `ANTHROPIC_API_KEY` — required for all AI features
- `BACKEND_URL`, `FRONTEND_URL` — for CORS (defaults work for local dev)

## Architecture

### Services

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS, port 5173
- **Backend**: FastAPI + Python 3.11, port 8000
- **LaTeX Compiler**: Tectonic in Docker container, called by backend to compile `.tex` → PDF

### Frontend Architecture

- **Routing** (`react-router-dom` v7): `/` → Home, `/create?mode=upload|form|jd` → input flow, `/editor/:id` → editor, `/preview/:id` → PDF viewer
- **State**: Single Zustand store (`src/store/resumeStore.ts`) persisted to localStorage — this is the source of truth for the current resume being edited
- **API**: Axios client in `src/services/apiClient.ts` (base URL from `VITE_API_URL` env var, 30s timeout)
- **Multi-step form**: `ResumeForm.tsx` has 6 steps in `src/components/forms/steps/`; the `Editor.tsx` page (~60KB) is the central hub with Edit / Enhance / Score tabs

### Backend Architecture

- **Routers** in `backend/app/routers/`: `resume.py` (CRUD), `upload.py` (parse PDF/DOCX), `enhance.py` (AI bullets), `compile.py` (LaTeX → PDF), `score.py` (ATS scoring)
- **Claude integration**: `backend/app/services/claude_service.py` — `ClaudeService` class with tenacity retry (3 attempts, exponential backoff). All prompts live in `backend/app/utils/prompt_templates.py`
- **Storage**: JSON files on disk at `STORAGE_PATH` (default `/backend/storage/`), keyed by resume UUID. No database.
- **LaTeX templates**: 5 templates (`jakes_resume`, `modern`, `classic`, `minimal`, `deedy`) under `backend/templates/{id}/`. Jinja2 renders `.tex` files; LaTeX special characters must be escaped before injection.

### Data Model

Core Pydantic model (`backend/app/models/resume.py`):

```
Resume
├── personal: PersonalInfo (name, email, phone, location, linkedin, github, website)
├── summary?: str
├── experience: List[Experience] (company, position, location, dates, bullets, keywords)
├── education: List[Education]
├── skills: Skills (technical, languages, frameworks, tools)
├── projects: List[Project]
├── certifications: List[Certification]
└── metadata: ResumeMetadata (template, lastModified, targetJD, atsScore)
```

Frontend TypeScript types mirror this in `frontend/src/types/resume.ts`.

### AI / Claude Usage

The backend uses `claude-sonnet-4-6` (configurable via `CLAUDE_MODEL` env var). Claude is called for:

1. Parsing uploaded PDF/DOCX into the Resume schema
2. Enhancing bullet points
3. Tailoring resume to a job description
4. ATS scoring and keyword analysis

All Claude calls return structured JSON; parse failures are surfaced as API errors.

## Code Organization Principles

### Modular Architecture

**ALWAYS follow a modular approach when writing or refactoring code:**

1. **Component Size**: Keep components under 300 lines. If a component exceeds this, split it into smaller, focused modules.

2. **Single Responsibility**: Each component/file should have one clear purpose:
   - UI components: Only rendering and user interactions
   - Hooks: Only state logic and side effects
   - Utils: Only pure functions and helpers
   - Types: Only type definitions

3. **Directory Structure**: Group related components in subdirectories:

   ```
   feature/
   ├── index.tsx           # Main component
   ├── types.ts            # Types
   ├── hooks/              # Custom hooks
   ├── components/         # Sub-components
   └── utils/              # Helper functions
   ```

4. **Extraction Priority**:
   - Extract pure presentational components first (icons, wrappers)
   - Then extract stateful sections
   - Finally refactor parent to orchestrate children

5. **Naming Conventions**:
   - Components: PascalCase matching filename (`PersonalModal.tsx`)
   - Hooks: camelCase with `use` prefix (`useEditTabState.ts`)
   - Directories: camelCase (`modals/`, `sections/`)

6. **Barrel Exports**: Use `index.ts` files for clean imports:
   ```typescript
   // components/editor/index.ts
   export { default as EditTab } from "./tabs/EditTab";
   export * from "./types";
   ```
