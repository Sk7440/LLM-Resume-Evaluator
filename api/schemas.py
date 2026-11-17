from typing import Literal

from pydantic import BaseModel, Field


class SectionAudit(BaseModel):
    section_name: str
    status: Literal["Strong", "Needs Work", "Missing"]
    actionable_fix: str


class BulletImprovement(BaseModel):
    original: str
    improved: str
    reason: str


class MatchResult(BaseModel):
    ats_score: int = Field(ge=0, le=100)
    summary_verdict: str = Field(min_length=10)
    matched_keywords: list[str]
    missing_keywords: list[str]
    section_feedback: list[SectionAudit]
    bullet_rewrites: list[BulletImprovement]


class CVClassification(BaseModel):
    is_resume: bool
    confidence: int = Field(ge=0, le=100)
    reason: str = Field(min_length=10)
