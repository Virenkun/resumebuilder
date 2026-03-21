# Development Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose
- **Claude API Key** from Anthropic

## Quick Start

### 1. Clone and Navigate

```bash
cd /Users/virensoni/Documents/resumebuilder
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Claude API key:

```env
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 4. Install Backend Dependencies

```bash
cd ../backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 5. Run with Docker Compose (Recommended)

From the project root:

```bash
docker-compose up --build
```

This will start:

- **Frontend** at http://localhost:5173
- **Backend API** at http://localhost:8000
- **LaTeX Compiler** service (running in background)

### 6. Run Manually (Alternative)

**Terminal 1 - Backend:**

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## Verify Installation

### 1. Check Backend Health

Visit http://localhost:8000/health

Expected response:

```json
{ "status": "healthy" }
```

### 2. Check API Documentation

Visit http://localhost:8000/docs for interactive API documentation

### 3. Check Frontend

Visit http://localhost:5173 to see the homepage with three resume creation options

## Project Structure

```
resumebuilder/
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   └── package.json
│
├── backend/               # FastAPI + Python
│   ├── app/
│   │   ├── models/       # Pydantic models
│   │   ├── routers/      # API endpoints
│   │   ├── services/     # Business logic (Claude, LaTeX)
│   │   ├── utils/        # Helpers and prompts
│   │   └── main.py       # FastAPI app
│   └── requirements.txt
│
├── latex-compiler/       # Docker container for Tectonic
│   └── Dockerfile
│
└── docker-compose.yml    # Orchestration
```

## Development Workflow

### Making Changes

1. **Frontend Changes**: Hot reload is enabled, changes appear instantly
2. **Backend Changes**: Uvicorn auto-reloads on file changes
3. **New Dependencies**:
   - Frontend: `cd frontend && npm install <package>`
   - Backend: Add to `requirements.txt` and `pip install -r requirements.txt`

### Debugging

**Backend Logs:**

```bash
docker-compose logs -f backend
```

**Frontend Logs:**

```bash
docker-compose logs -f frontend
```

**All Services:**

```bash
docker-compose logs -f
```

## Testing the Setup

### Test Resume Creation Endpoint

```bash
curl -X POST http://localhost:8000/api/resume/create \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-resume-1",
    "personal": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "123-456-7890",
      "location": "San Francisco, CA"
    },
    "experience": [],
    "education": [],
    "skills": {
      "technical": ["Python", "JavaScript"],
      "languages": [],
      "frameworks": [],
      "tools": []
    },
    "projects": [],
    "certifications": [],
    "metadata": {}
  }'
```

Expected: 200 OK with resume JSON

## Common Issues

### Port Already in Use

If ports 8000 or 5173 are already in use:

```bash
# Find process using port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
```

### Docker Build Fails

```bash
# Clean up and rebuild
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Python Dependencies Error

```bash
# Upgrade pip first
pip install --upgrade pip
pip install -r requirements.txt
```

### LaTeX Compilation Issues

The LaTeX compiler will auto-download packages on first use. First compilation may take longer.

## Next Steps

Once setup is complete, you can start implementing features in this order:

1. **Phase 1A**: Manual Form (Fill by Info)
2. **Phase 3**: LaTeX Compilation
3. **Phase 1B**: Upload & Parse
4. **Phase 2**: AI Enhancement
5. **Phase 4**: Preview & Download

See `/Users/virensoni/.claude/plans/parallel-dreaming-storm.md` for detailed implementation plan.

## Environment Variables Reference

| Variable                | Description              | Default                 |
| ----------------------- | ------------------------ | ----------------------- |
| `ANTHROPIC_API_KEY`     | Your Claude API key      | (required)              |
| `BACKEND_URL`           | Backend server URL       | `http://localhost:8000` |
| `FRONTEND_URL`          | Frontend URL for CORS    | `http://localhost:5173` |
| `STORAGE_PATH`          | Resume storage directory | `./backend/storage`     |
| `MAX_FILE_SIZE_MB`      | Max upload size          | `10`                    |
| `LATEX_COMPILE_TIMEOUT` | LaTeX timeout (seconds)  | `10`                    |
| `CLAUDE_MODEL`          | Claude model to use      | `claude-sonnet-4-6`     |
| `CLAUDE_MAX_TOKENS`     | Max response tokens      | `4096`                  |

## Support

For issues or questions:

- Check the logs: `docker-compose logs`
- Review API docs: http://localhost:8000/docs
- Check plan file: `.claude/plans/parallel-dreaming-storm.md`
