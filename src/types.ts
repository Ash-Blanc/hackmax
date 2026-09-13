export type HackathonStatus = 'upcoming' | 'active' | 'submitted' | 'ended';
export type TaskStage = 'NOW' | 'NEXT' | 'LATER' | 'SUBMISSION';
export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ImpactLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cut';

export interface Hackathon {
  id: string;
  userId: string;
  title: string;
  url: string;
  tagline: string;
  description: string;
  startDate: string;
  endDate: string;
  timezone: string;
  status: HackathonStatus;
  prizePool: string;
  maxScore: number;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
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
  createdAt: string;
}

export interface Criteria {
  id: string;
  hackathonId: string;
  name: string;
  weight: number;
  score: number;
  confidence: number;
  explanation: string;
  recommendedFix: string;
  createdAt: string;
}

export interface JudgeReview {
  id: string;
  hackathonId: string;
  persona: string;
  overallScore: number;
  summary: string;
  biggestWeakness: string;
  recommendedFix: string;
  criteriaScores: Record<string, number>;
  strengths?: string[];
  createdAt: string;
}

export interface GitHubActivity {
  id: string;
  projectId: string;
  activityType: 'commit' | 'pr_opened' | 'pr_merged' | 'issue_closed';
  title: string;
  author: string;
  url: string;
  timestamp: string;
}

export interface SubmissionChecklist {
  id: string;
  hackathonId: string;
  itemKey: string;
  label: string;
  completed: boolean;
  value: string | null;
  required: boolean;
  createdAt: string;
}

// Types used by store.tsx
export interface ChecklistItem {
  id: string;
  hackathonId: string;
  itemKey: string;
  label: string;
  completed: boolean;
  value: string | null;
  required: boolean;
  createdAt: string;
}

export type Criterion = Criteria;

export interface AppState {
  profile: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
    githubUsername: string | null;
    targetGoal: string;
  };
  hackathons: Hackathon[];
  projects: Project[];
  tasks: Task[];
  criteria: Criteria[];
  checklist: ChecklistItem[];
  judgeReviews: JudgeReview[];
  githubActivity: GitHubActivity[];
  notifications: { id: string; text: string; read: boolean }[];
  demoMode: boolean;
  onboarded: boolean;
  githubConnected: boolean;
}

export interface NotificationItem {
  id: string;
  text: string;
  read: boolean;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type TargetGoal = 'win_more' | 'ship_faster' | 'all_of_above';

export interface Remaining {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  overdue: boolean;
  urgency: 'critical' | 'hot' | 'warn' | 'ok';
  label: string;
}

export interface NextAction {
  task: Task;
  headline: string;
  why: string;
  expectedLift: string;
}

export interface CopilotContext {
  hoursLabel: string;
  nextTitle: string;
  nextWhy: string;
  maxScore: number;
  weakest: string;
}