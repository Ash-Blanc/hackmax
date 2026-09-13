export type HackathonStatus = "upcoming" | "active" | "submitted" | "ended";
export type TaskStage = "NOW" | "NEXT" | "LATER" | "SUBMISSION";
export type TaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type TaskStatus = "todo" | "in_progress" | "done" | "cut";
export type ImpactLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type JudgePersona = "overall" | "technical" | "product" | "design";
export type GithubActivityType = "commit" | "pr_opened" | "pr_merged" | "issue_closed";
export type TargetGoal = "win_more" | "ship_faster" | "all_of_above";

export interface Profile {
  id: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  githubUsername: string;
  targetGoal: TargetGoal;
}

export interface Criterion {
  id: string;
  hackathonId: string;
  name: string;
  weight: number;
  score: number;
  confidence: number;
  explanation: string;
  recommendedFix: string;
}

export interface Task {
  id: string;
  hackathonId: string;
  title: string;
  stage: TaskStage;
  priority: TaskPriority;
  estimatedMinutes: number;
  impactLevel: ImpactLevel;
  status: TaskStatus;
  githubIssueUrl?: string;
  relatedCriterionId?: string;
  sortOrder: number;
  why?: string;
}

export interface ChecklistItem {
  id: string;
  hackathonId: string;
  itemKey: string;
  label: string;
  completed: boolean;
  value?: string;
  required: boolean;
}

export interface Hackathon {
  id: string;
  userId: string;
  title: string;
  url?: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  status: HackathonStatus;
  prizePool: string;
  maxScore: number;
  projectId?: string;
  location?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  tagline: string;
  description: string;
  techStack: string[];
  capabilities: string[];
  reusableComponents: string[];
  repositoryName: string;
  repositoryUrl: string;
  lastCommitAt: string;
  openIssues: number;
  openPrs: number;
  buildStatus: "passing" | "failing" | "pending";
}

export interface GithubActivity {
  id: string;
  projectId: string;
  activityType: GithubActivityType;
  title: string;
  author: string;
  url: string;
  timestamp: string;
  sha?: string;
}

export interface JudgeReview {
  id: string;
  hackathonId: string;
  persona: JudgePersona;
  overallScore: number;
  summary: string;
  biggestWeakness: string;
  recommendedFix: string;
  strengths: string[];
  criteriaScores: Record<string, number>;
}

export interface Opportunity {
  id: string;
  title: string;
  organizer: string;
  startsIn: string;
  duration: string;
  prizePool: string;
  matchScore: number;
  reusePercent: number;
  tags: string[];
  url: string;
  remote: boolean;
  adaptationHours: number;
  why: string;
}

export interface AnalyticsPoint {
  t: string;
  maxScore: number;
  hoursSpent: number;
  impactHours: number;
  slopHours: number;
}

export interface AppState {
  profile: Profile;
  demoMode: boolean;
  githubConnected: boolean;
  onboarded: boolean;
  hackathons: Hackathon[];
  projects: Project[];
  criteria: Criterion[];
  tasks: Task[];
  checklist: ChecklistItem[];
  activity: GithubActivity[];
  reviews: JudgeReview[];
  opportunities: Opportunity[];
  analytics: AnalyticsPoint[];
  notifications: NotificationItem[];
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: "deadline" | "insight" | "github" | "judge";
}

export interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  openui?: string;
  createdAt: string;
}
