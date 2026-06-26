import type { TaskDifficulty, TaskType } from "@/types";

const BASE_POINTS: Record<TaskDifficulty, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export function calculateTaskPoints(
  difficulty: TaskDifficulty,
  rating: number
): number {
  return Math.round(BASE_POINTS[difficulty] * (rating / 5));
}

export function calculateStreakBonus(streak: number): number {
  if (streak >= 10) return 50;
  if (streak >= 5) return 25;
  if (streak >= 3) return 10;
  return 0;
}

export function calculateVarietyBonus(taskTypes: TaskType[]): number {
  const unique = new Set(taskTypes).size;
  if (unique >= 8) return 75;
  if (unique >= 5) return 40;
  if (unique >= 3) return 15;
  return 0;
}