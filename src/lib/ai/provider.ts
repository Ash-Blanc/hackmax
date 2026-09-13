import type { Criteria, Hackathon, JudgeReview, Project, Task } from "@/types";

export interface NextAction {
  task: Task;
  headline: string;
  why: string;
  expectedLift: string;
}

export function pickNextAction(tasks: Task[]): Task | undefined {
  const open = tasks.filter((t) => t.status === "todo" || t.status === "in_progress");
  const rank = (t: Task) => {
    const stage = { NOW: 40, NEXT: 25, SUBMISSION: 30, LATER: 5 }[t.stage];
    const impact = { CRITICAL: 40, HIGH: 25, MEDIUM: 12, LOW: 4 }[t.impactLevel];
    const status = t.status === "in_progress" ? 8 : 0;
    return stage + impact + status - t.estimatedMinutes / 20;
  };
  return [...open].sort((a, b) => rank(b) - rank(a))[0];
}

export function explainNext(task: Task, hackathon: Hackathon, hoursLeft: number): NextAction {
  return {
    task,
    headline: task.title,
    why: `Highest expected score lift for ${hackathon.title} with ${Math.max(0, Math.round(hoursLeft))}h remaining.`,
    expectedLift: task.impactLevel === "CRITICAL" ? "+6–9 Max Score" : task.impactLevel === "HIGH" ? "+3–5 Max Score" : "+1–2 Max Score",
  };
}

export function mockJudgeFromProject(hackathon: Hackathon, project: Project, criteria: Criteria[]): JudgeReview {
  const sorted = [...criteria].sort((a, b) => a.score - b.score);
  const lowest = sorted[0];
  return {
    id: `rev_live_${hackathon.id}`,
    hackathonId: hackathon.id,
    persona: "overall",
    overallScore: hackathon.maxScore / 10,
    summary: `${project.name} is a serious attempt at ${project.capabilities[0] ?? "the brief"}. Time remaining is the constraint, not imagination.`,
    biggestWeakness: lowest?.name ?? "Presentation",
    recommendedFix: lowest?.recommendedFix ?? "Record the demo.",
    criteriaScores: Object.fromEntries(criteria.map((c) => [c.name, c.score])),
    createdAt: new Date().toISOString(),
  };
}
