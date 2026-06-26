import type { TaskType, VerifiedCompletion } from "@/types";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const BADGE_RULES: {
  id: string;
  name: string;
  description: string;
  icon: string;
  check: (completions: VerifiedCompletion[]) => boolean;
}[] = [
  {
    id: "frontend-specialist",
    name: "Frontend Specialist",
    description: "Completed 3+ frontend tasks",
    icon: "🎨",
    check: (c) => c.filter((x) => x.taskType === "frontend").length >= 3,
  },
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Completed 3+ bug fix tasks",
    icon: "🐛",
    check: (c) => c.filter((x) => x.taskType === "bugfix").length >= 3,
  },
  {
    id: "fullstack-builder",
    name: "Fullstack Builder",
    description: "Completed 2+ fullstack tasks",
    icon: "⚡",
    check: (c) => c.filter((x) => x.taskType === "fullstack").length >= 2,
  },
  {
    id: "consistent-contributor",
    name: "Consistent Contributor",
    description: "Completed 5+ verified tasks",
    icon: "🔥",
    check: (c) => c.length >= 5,
  },
  {
    id: "top-rated",
    name: "Top Rated",
    description: "Average rating of 4.5+",
    icon: "⭐",
    check: (c) =>
      c.length >= 2 &&
      c.reduce((sum, x) => sum + x.rating, 0) / c.length >= 4.5,
  },
  {
    id: "devops-pro",
    name: "DevOps Pro",
    description: "Completed 2+ DevOps tasks",
    icon: "🚀",
    check: (c) => c.filter((x) => x.taskType === "devops").length >= 2,
  },
];

export function getBadgesForDev(
  completions: VerifiedCompletion[]
): Badge[] {
  return BADGE_RULES.filter((rule) => rule.check(completions)).map(
    ({ id, name, description, icon }) => ({ id, name, description, icon })
  );
}

export function countTasksByType(
  completions: VerifiedCompletion[],
  type: TaskType
): number {
  return completions.filter((c) => c.taskType === type).length;
}