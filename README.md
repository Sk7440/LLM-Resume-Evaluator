## Matchline Resume Evaluator

FastAPI and Next.js application for comparing a PDF or DOCX resume with a target job description. The backend extracts selectable text, sends a structured evaluation request to Groq, and returns a validated `MatchResult`.

### Structure

```text
backend: main.py, schemas.py, parser.py, evaluator.py, settings.py
frontend/
  app/                 App Router page and global styles
  components/          Upload, score, keywords, audit, and rewrite UI
  lib/api.ts           Typed backend client
```

### Run locally

From the repository root:

```powershell
uv sync
uv run uvicorn main:app --reload --port 8001
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The backend expects `GROQ_API_KEY` in the root `.env` and defaults to the currently available `openai/gpt-oss-120b` model. Set `GROQ_MODEL` in `.env` to override it. Set `NEXT_PUBLIC_API_URL` when the API is running on another port.