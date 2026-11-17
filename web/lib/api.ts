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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 180_000);

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    const endpoint = `${apiUrl ?? "http://localhost:8001"}/api/v1/evaluate`;
    const response = await fetch(endpoint, {
      method: "POST",
      body,
      signal: controller.signal,
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.detail ?? `The server returned HTTP ${response.status}. Please try again.`);
    }
    return data as MatchResult;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The evaluation timed out. Check the file and try again.");
    }
    if (error instanceof TypeError) {
      throw new Error("The evaluation service is unreachable. Check your connection and try again.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}
