"use client";

import { SEED_STATE } from "@/data/seed";
import { calculateDevPayout } from "@/lib/platform-fee";
import {
  calculateStreakBonus,
  calculateTaskPoints,
  calculateVarietyBonus,
} from "@/lib/points";
import type {
  AppState,
  Notification,
  Project,
  Submission,
  Task,
  TaskDifficulty,
  TaskType,
  User,
  UserRole,
  VerifiedCompletion,
} from "@/types";

const STORAGE_KEY = "taskforge-state";
const AUTH_KEY = "taskforge-auth";
const ROLE_KEY = "taskforge-active-role";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function loadState(): AppState {
  if (typeof window === "undefined") return deepClone(SEED_STATE);
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as AppState;
  } catch {
    /* use seed */
  }
  return deepClone(SEED_STATE);
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadAuthUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) return JSON.parse(stored) as User;
  } catch {
    /* ignore */
  }
  return null;
}

export function saveAuthUser(user: User | null): void {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  else localStorage.removeItem(AUTH_KEY);
}

export function loadActiveRole(user: User | null): UserRole {
  if (typeof window === "undefined") return user?.role ?? "junior";
  const stored = localStorage.getItem(ROLE_KEY) as UserRole | null;
  return stored ?? user?.role ?? "junior";
}

export function saveActiveRole(role: UserRole): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ROLE_KEY, role);
}

function addNotification(
  state: AppState,
  userId: string,
  type: Notification["type"],
  message: string,
  link?: string
): Notification {
  const notification: Notification = {
    id: generateId("notif"),
    userId,
    type,
    message,
    read: false,
    createdAt: new Date().toISOString(),
    link,
  };
  state.notifications.unshift(notification);
  return notification;
}

export function claimTask(
  state: AppState,
  taskId: string,
  devId: string
): AppState {
  const next = deepClone(state);
  const task = next.tasks.find((t) => t.id === taskId);
  const dev = next.users.find((u) => u.id === devId);
  if (!task || !dev || task.status !== "open") return state;

  task.status = "claimed";
  task.claimedBy = devId;
  task.claimedAt = new Date().toISOString();

  addNotification(
    next,
    task.hirerId,
    "task_claimed",
    `${dev.name} claimed "${task.title}"`,
    `/tasks/${taskId}`
  );

  return next;
}

export function submitTask(
  state: AppState,
  taskId: string,
  devId: string,
  data: {
    githubLink: string;
    demoLink?: string;
    notes: string;
    timeSpentHours: number;
  }
): AppState {
  const next = deepClone(state);
  const task = next.tasks.find((t) => t.id === taskId);
  const dev = next.users.find((u) => u.id === devId);
  if (!task || !dev || task.claimedBy !== devId) return state;

  const submission: Submission = {
    id: generateId("sub"),
    taskId,
    devId,
    devName: dev.name,
    githubLink: data.githubLink,
    demoLink: data.demoLink,
    notes: data.notes,
    timeSpentHours: data.timeSpentHours,
    submittedAt: new Date().toISOString(),
    status: "pending",
  };

  next.submissions.push(submission);
  task.status = "submitted";

  addNotification(
    next,
    task.hirerId,
    "submission_received",
    `${dev.name} submitted work for "${task.title}"`,
    `/tasks/${taskId}`
  );

  return next;
}

export function reviewSubmission(
  state: AppState,
  submissionId: string,
  hirerId: string,
  approved: boolean,
  rating: number,
  feedback: string
): AppState {
  const next = deepClone(state);
  const submission = next.submissions.find((s) => s.id === submissionId);
  if (!submission) return state;

  const task = next.tasks.find((t) => t.id === submission.taskId);
  const hirer = next.users.find((u) => u.id === hirerId);
  const dev = next.users.find((u) => u.id === submission.devId);
  if (!task || !hirer || !dev || task.hirerId !== hirerId) return state;

  submission.review = {
    rating,
    feedback,
    reviewedBy: hirerId,
    reviewedByName: hirer.name,
    reviewedAt: new Date().toISOString(),
  };

  if (!approved) {
    submission.status = "rejected";
    task.status = "claimed";
    addNotification(
      next,
      submission.devId,
      "review_complete",
      `Your submission for "${task.title}" needs revision`,
      `/tasks/${task.id}`
    );
    return next;
  }

  submission.status = "approved";
  task.status = "verified";

  const bountyPaid = calculateDevPayout(task.bounty);
  const points = calculateTaskPoints(task.difficulty, rating);

  const completion: VerifiedCompletion = {
    id: generateId("vc"),
    taskId: task.id,
    taskTitle: task.title,
    projectName: task.projectName,
    taskType: task.type,
    devId: submission.devId,
    rating,
    feedback,
    githubLink: submission.githubLink,
    demoLink: submission.demoLink,
    completedAt: new Date().toISOString(),
    bountyPaid,
  };
  next.verifiedCompletions.unshift(completion);

  const devCompletions = next.verifiedCompletions.filter(
    (c) => c.devId === submission.devId
  );
  const totalRating = devCompletions.reduce((s, c) => s + c.rating, 0);
  const taskTypes = devCompletions.map((c) => c.taskType);
  const streakBonus = calculateStreakBonus(dev.stats.currentStreak + 1);
  const varietyBonus = calculateVarietyBonus(taskTypes);

  dev.stats.tasksCompleted += 1;
  dev.stats.totalPoints += points + streakBonus + varietyBonus;
  dev.stats.avgRating = totalRating / devCompletions.length;
  dev.stats.totalEarned += bountyPaid;
  dev.stats.currentStreak += 1;

  if (loadAuthUser()?.id === dev.id) {
    saveAuthUser(dev);
  }

  addNotification(
    next,
    submission.devId,
    "review_complete",
    `Your work on "${task.title}" was verified! +${points} points`,
    `/devs/${dev.username}`
  );

  return next;
}

export function createProject(
  state: AppState,
  hirerId: string,
  data: Omit<Project, "id" | "hirerId" | "hirerName" | "published" | "createdAt">
): AppState {
  const next = deepClone(state);
  const hirer = next.users.find((u) => u.id === hirerId);
  if (!hirer) return state;

  const project: Project = {
    id: generateId("proj"),
    hirerId,
    hirerName: hirer.name,
    published: true,
    createdAt: new Date().toISOString(),
    ...data,
  };
  next.projects.unshift(project);
  return next;
}

export function createTasks(
  state: AppState,
  hirerId: string,
  projectId: string,
  tasks: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    type: TaskType;
    difficulty: TaskDifficulty;
    estimatedHours: number;
    bounty: number;
    techTags: string[];
  }[]
): AppState {
  const next = deepClone(state);
  const project = next.projects.find((p) => p.id === projectId);
  if (!project || project.hirerId !== hirerId) return state;

  for (const t of tasks) {
    const task: Task = {
      id: generateId("task"),
      projectId,
      projectName: project.title,
      hirerId,
      status: "open",
      createdAt: new Date().toISOString(),
      ...t,
    };
    next.tasks.unshift(task);
    addNotification(
      next,
      hirerId,
      "task_posted",
      `New task posted: "${task.title}"`,
      `/tasks/${task.id}`
    );
  }

  return next;
}

export function signUpUser(
  state: AppState,
  data: {
    name: string;
    email: string;
    role: UserRole;
    github: string;
    skills: string[];
  }
): { state: AppState; user: User } {
  const next = deepClone(state);
  const username = data.github.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const user: User = {
    id: generateId("user"),
    username,
    name: data.name,
    email: data.email,
    role: data.role,
    github: data.github,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    skills: data.skills,
    joinedAt: new Date().toISOString(),
    stats: {
      tasksCompleted: 0,
      totalPoints: 0,
      avgRating: 0,
      totalEarned: 0,
      currentStreak: 0,
    },
  };
  next.users.push(user);
  return { state: next, user };
}

export function loginAsDemo(
  state: AppState,
  role: UserRole
): { state: AppState; user: User } | null {
  const user = state.users.find(
    (u) => u.role === role && (role === "hirer" ? u.id === "hirer-1" : u.id === "dev-1")
  );
  if (!user) return null;
  return { state, user: deepClone(user) };
}

export function updateUserSkills(
  state: AppState,
  userId: string,
  skills: string[]
): AppState {
  const next = deepClone(state);
  const user = next.users.find((u) => u.id === userId);
  if (!user) return state;
  user.skills = skills;
  if (loadAuthUser()?.id === userId) saveAuthUser(user);
  return next;
}

export function markNotificationsRead(
  state: AppState,
  userId: string
): AppState {
  const next = deepClone(state);
  next.notifications.forEach((n) => {
    if (n.userId === userId) n.read = true;
  });
  return next;
}

export function getLeaderboard(state: AppState) {
  return state.users
    .filter((u) => u.role === "junior")
    .sort((a, b) => b.stats.totalPoints - a.stats.totalPoints)
    .map((u, i) => ({ ...u, rank: i + 1 }));
}

export function getAllTechTags(state: AppState): string[] {
  const tags = new Set<string>();
  state.tasks.forEach((t) => t.techTags.forEach((tag) => tags.add(tag)));
  return Array.from(tags).sort();
}