export type SectionStatus = "Strong" | "Needs Work" | "Missing";
export type MatchResult = {
  ats_score: number;
  summary_verdict: string;
  matched_keywords: string[];
  missing_keywords: string[];
  section_feedback: { section_name: string; status: SectionStatus; actionable_fix: string }[];
  bullet_rewrites: { original: string; improved: string; reason: string }[];
};

export async function evaluateResume(file: File, jobDescription: string): Promise<MatchResult> {
  const body = new FormData();
  body.append("resume_file", file);
  body.append("job_description", jobDescription);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8001"}/api/v1/evaluate`, { method: "POST", body });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail ?? "We could not complete the evaluation.");
  return data as MatchResult;
}
