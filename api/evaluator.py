import json

from groq import Groq, GroqError

try:
    from .schemas import CVClassification, MatchResult
except ImportError:
    from schemas import CVClassification, MatchResult

SYSTEM_PROMPT = """You are an expert recruiter and ATS optimization specialist.
Evaluate a resume against a target job description. Be evidence-based and concise.
Return only valid JSON matching the supplied schema. summary_verdict must be exactly
two sentences. Include audits for Summary, Experience, Skills, and Education when
possible. Suggest rewrites only for bullets that could be materially improved."""

CV_CHECK_PROMPT = """Determine whether the document is a curriculum vitae or resume.
It must contain personal career evidence such as work experience, skills, education,
projects, qualifications, or an employment history.
Reject job descriptions, invoices, articles, certificates alone, contracts,
academic papers, cover letters, ID cards, and unrelated documents.
Return strict JSON. Use is_resume=false when unsure."""


def is_resume_document(resume_text: str, api_key: str, model: str) -> CVClassification:
    client = Groq(api_key=api_key)
    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0,
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "cv_classification",
                    "schema": CVClassification.model_json_schema(),
                },
            },
            messages=[
                {"role": "system", "content": CV_CHECK_PROMPT},
                {"role": "user", "content": resume_text[:12_000]},
            ],
        )
    except GroqError as exc:
        raise RuntimeError("We could not verify the uploaded document. Please try again.") from exc

    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("We could not verify the uploaded document. Please try again.")
    try:
        return CVClassification.model_validate(json.loads(content))
    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError("The document verification response was invalid. Please try again.") from exc


def evaluate_resume(resume_text: str, job_description: str, api_key: str, model: str) -> MatchResult:
    client = Groq(api_key=api_key)
    try:
        response = client.chat.completions.create(
            model=model,
            temperature=0.2,
            response_format={
                "type": "json_schema",
                "json_schema": {"name": "match_result", "schema": MatchResult.model_json_schema()},
            },
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}",
                },
            ],
        )
    except GroqError as exc:
        raise RuntimeError(
            "The evaluation provider could not process this request. "
            "Check GROQ_API_KEY and GROQ_MODEL, then try again."
        ) from exc
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("The evaluation provider returned an empty response.")
    try:
        return MatchResult.model_validate(json.loads(content))
    except (json.JSONDecodeError, ValueError) as exc:
        raise RuntimeError("The evaluation provider returned an invalid structured response.") from exc
