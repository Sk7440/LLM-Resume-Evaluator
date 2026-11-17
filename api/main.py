from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from .evaluator import evaluate_resume
from .parser import extract_resume_text
from .schemas import MatchResult
from .settings import get_settings

settings = get_settings()
app = FastAPI(title="Resume Match Evaluator", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.frontend_origin.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/evaluate", response_model=MatchResult)
async def evaluate(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
) -> MatchResult:
    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Paste a job description before analyzing.")
    if len(job_description) > 50_000:
        raise HTTPException(status_code=400, detail="Job descriptions must be 50,000 characters or fewer.")

    resume_text = await extract_resume_text(resume_file)
    try:
        return evaluate_resume(
            resume_text,
            job_description.strip(),
            settings.groq_api_key,
            settings.groq_model,
        )
    except RuntimeError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
