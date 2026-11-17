## Matchline Resume Evaluator

FastAPI and Next.js application for comparing a PDF or DOCX resume with a target job description. The backend extracts selectable text, sends a structured evaluation request to Groq, and returns a validated `MatchResult`.

### Structure

```text
api/
  main.py, schemas.py, parser.py, evaluator.py, settings.py
web/
  app/                 App Router page and global styles
  components/          Upload, score, keywords, audit, and rewrite UI
  lib/api.ts           Typed backend client
```

### Run locally

From the repository root:

```powershell
uv sync
uv run uvicorn api.main:app --reload --port 8001
```

In a second terminal:

```powershell
cd web
npm install
npm run dev
```

Open `http://localhost:3000`. The backend expects `GROQ_API_KEY` in the root `.env` and defaults to the currently available `openai/gpt-oss-120b` model. Set `GROQ_MODEL` in `.env` to override it.

## Deployment

The repository includes a root `vercel.json` that installs and builds the Next.js app from `web`. If the Vercel project has a Root Directory configured, set it to the repository root, not `web`.

Add this Vercel environment variable:

```text
NEXT_PUBLIC_API_URL=https://YOUR-API-DOMAIN.example.com
```

Deploy `api` as a separate FastAPI service with `uvicorn api.main:app --host 0.0.0.0 --port $PORT`, and configure `GROQ_API_KEY`, `GROQ_MODEL`, and `FRONTEND_ORIGIN` there. Set `FRONTEND_ORIGIN` to the exact Vercel URL. The deployed frontend cannot call a backend running on localhost.

For Render, use the included `render.yaml` Blueprint. Render will ask for the secret `GROQ_API_KEY` privately during service creation.