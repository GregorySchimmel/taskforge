"use client";

import { useMemo, useState } from "react";
import { Anvil } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskFilters, type TaskFilterState } from "@/components/tasks/TaskFilters";
import { TaskModal } from "@/components/tasks/TaskModal";
import type { Task } from "@/types";

export default function TasksPage() {
  const { state, techTags, user, claimTaskById } = useApp();
  const [filters, setFilters] = useState<TaskFilterState>({
    search: "",
    difficulty: "all",
    minBounty: 0,
    techStack: [],
    status: "open",
  });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return state.tasks.filter((task) => {
      if (filters.status !== "all" && task.status !== filters.status) return false;
      if (filters.difficulty !== "all" && task.difficulty !== filters.difficulty) return false;
      if (task.bounty < filters.minBounty) return false;
      if (filters.techStack.length > 0 && !filters.techStack.some((t) => task.techTags.includes(t))) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const match =
          task.title.toLowerCase().includes(q) ||
          task.description.toLowerCase().includes(q) ||
          task.projectName.toLowerCase().includes(q) ||
          task.techTags.some((t) => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [state.tasks, filters]);

  const handleClaim = () => {
    if (!selectedTask) return;
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (claimTaskById(selectedTask.id)) {
      setModalOpen(false);
      setSelectedTask(null);
    }
  };

  return (
    <div className="mx-auto max-w-[100vw] px-4 py-8 sm:px-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
            <Anvil className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Task Type Board</h1>
            <p className="text-sm text-muted-foreground">
              {filteredTasks.length} tasks available — claim work that matches your skills
            </p>
          </div>
        </div>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} techTags={techTags} />

      <div className="mt-6">
        <KanbanBoard
          tasks={filteredTasks}
          onTaskClick={(task) => {
            setSelectedTask(task);
            setModalOpen(true);
          }}
        />
      </div>

      <TaskModal
        task={selectedTask}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onClaim={handleClaim}
      />
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultRole="talent" />
    </div>
  );
}