export type UserRole = "talent" | "employer";
export type TalentDiscipline = "development" | "web_design" | "video_editing";
export type TaskType =
  | "frontend"
  | "backend"
  | "fullstack"
  | "devops"
  | "testing"
  | "documentation"
  | "bugfix"
  | "feature"
  | "uiux"
  | "web_design"
  | "video_editing"
  | "other";
export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskStatus =
  | "open"
  | "claimed"
  | "submitted"
  | "completed"
  | "verified";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface EmployerSubscription {
  status: "trial" | "active" | "expired";
  plan: "starter" | "pro" | null;
  expiresAt: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  /** Primary portfolio link or GitHub profile */
  portfolioUrl: string;
  /** @deprecated use portfolioUrl — kept for backward compat */
  github?: string;
  disciplines?: TalentDiscipline[];
  companyName?: string;
  subscription?: EmployerSubscription;
  avatar?: string;
  bio?: string;
  skills: string[];
  location?: string;
  joinedAt: string;
  stats: {
    tasksCompleted: number;
    totalPoints: number;
    avgRating: number;
    totalEarned: number;
    currentStreak: number;
  };
}

export interface Project {
  id: string;
  hirerId: string;
  hirerName: string;
  title: string;
  description: string;
  goals: string;
  repoUrl?: string;
  techStack: string[];
  published: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  projectName: string;
  hirerId: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  type: TaskType;
  difficulty: TaskDifficulty;
  estimatedHours: number;
  bounty: number;
  techTags: string[];
  status: TaskStatus;
  claimedBy?: string;
  claimedAt?: string;
  deadline?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  taskId: string;
  devId: string;
  devName: string;
  githubLink: string;
  demoLink?: string;
  notes: string;
  timeSpentHours: number;
  submittedAt: string;
  status: SubmissionStatus;
  review?: {
    rating: number;
    feedback: string;
    reviewedBy: string;
    reviewedByName: string;
    reviewedAt: string;
  };
}

export interface VerifiedCompletion {
  id: string;
  taskId: string;
  taskTitle: string;
  projectName: string;
  taskType: TaskType;
  devId: string;
  rating: number;
  feedback: string;
  githubLink: string;
  demoLink?: string;
  completedAt: string;
  bountyPaid: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "task_claimed" | "submission_received" | "review_complete" | "task_posted";
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AppState {
  users: User[];
  projects: Project[];
  tasks: Task[];
  submissions: Submission[];
  verifiedCompletions: VerifiedCompletion[];
  notifications: Notification[];
}

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "fullstack", label: "Fullstack" },
  { value: "devops", label: "DevOps" },
  { value: "testing", label: "Testing/QA" },
  { value: "documentation", label: "Documentation" },
  { value: "bugfix", label: "Bug Fixes" },
  { value: "feature", label: "Feature Development" },
  { value: "uiux", label: "UI/UX" },
  { value: "web_design", label: "Web Design" },
  { value: "video_editing", label: "Video Editing" },
  { value: "other", label: "Other" },
];

export const DIFFICULTY_COLORS: Record<TaskDifficulty, string> = {
  easy: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  hard: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};