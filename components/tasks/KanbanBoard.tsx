"use client";

import { AnimatePresence } from "framer-motion";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TASK_TYPES } from "@/types";
import type { Task, TaskType } from "@/types";

export function KanbanBoard({
  tasks,
  onTaskClick,
}: {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}) {
  const tasksByType = TASK_TYPES.reduce(
    (acc, { value }) => {
      acc[value] = tasks.filter((t) => t.type === value);
      return acc;
    },
    {} as Record<TaskType, Task[]>
  );

  return (
    <div className="overflow-x-auto scrollbar-thin pb-4">
      <div className="flex gap-4 min-w-max">
        {TASK_TYPES.map(({ value, label }) => {
          const columnTasks = tasksByType[value];
          return (
            <div key={value} className="w-72 shrink-0">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold">{label}</h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {columnTasks.length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px] rounded-lg border border-border/50 bg-secondary/20 p-3">
                <AnimatePresence mode="popLayout">
                  {columnTasks.length === 0 ? (
                    <p className="py-8 text-center text-xs text-muted-foreground">No tasks here</p>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}