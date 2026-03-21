# AI Resume Builder

An AI-powered resume builder that helps create professional, ATS-optimized resumes using Claude AI and LaTeX templates.

## Features

- **Multiple Input Modes**: Upload existing resume (PDF/DOCX), fill manual form, or generate from job description
- **AI Enhancement**: Improve bullet points with strong action verbs and quantified metrics
- **Job Description Tailoring**: Align resume to specific job postings
- **Professional PDFs**: Generate beautiful resumes using LaTeX templates
- **ATS Optimization**: Get scores and suggestions for passing applicant tracking systems

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + TypeScript
- **Backend**: FastAPI + Python 3.11+
- **AI**: Claude API (claude-sonnet-4-6)
- **LaTeX**: Docker + Tectonic
- **State Management**: Zustand

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Claude API key

### Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd resumebuilder
```

2. Set up environment variables:

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

4. Install backend dependencies:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

5. Start services with Docker Compose:

```bash
docker-compose up -d
```

### Development

Run frontend (http://localhost:5173):

```bash
cd frontend
npm run dev
```

Run backend (http://localhost:8000):

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

## Project Structure

```
resumebuilder/
├── frontend/          # React + Tailwind frontend
├── backend/           # FastAPI backend
├── latex-compiler/    # Docker container for LaTeX compilation
├── shared/            # Shared schemas
└── docker-compose.yml
```

## API Documentation

Once the backend is running, visit:

- API Docs: http://localhost:8000/docs
- Alternative Docs: http://localhost:8000/redoc

## License

MIT
