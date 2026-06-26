"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { TaskDifficulty, TaskStatus } from "@/types";

export interface TaskFilterState {
  search: string;
  difficulty: TaskDifficulty | "all";
  minBounty: number;
  techStack: string[];
  status: TaskStatus | "all";
}

export function TaskFilters({
  filters,
  onChange,
  techTags,
}: {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
  techTags: string[];
}) {
  const toggleTech = (tag: string) => {
    const next = filters.techStack.includes(tag)
      ? filters.techStack.filter((t) => t !== tag)
      : [...filters.techStack, tag];
    onChange({ ...filters, techStack: next });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card/50 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
            aria-label="Search tasks"
          />
        </div>
        <Select
          value={filters.difficulty}
          onChange={(e) => onChange({ ...filters, difficulty: e.target.value as TaskDifficulty | "all" })}
          aria-label="Filter by difficulty"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>
        <Select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as TaskStatus | "all" })}
          aria-label="Filter by status"
        >
          <option value="open">Open Only</option>
          <option value="all">All Statuses</option>
          <option value="claimed">Claimed</option>
          <option value="submitted">Submitted</option>
          <option value="verified">Verified</option>
        </Select>
        <Select
          value={filters.minBounty}
          onChange={(e) => onChange({ ...filters, minBounty: Number(e.target.value) })}
          aria-label="Minimum bounty"
        >
          <option value={0}>Any Bounty</option>
          <option value={50}>$50+</option>
          <option value={100}>$100+</option>
          <option value={150}>$150+</option>
        </Select>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Tech:</span>
        {techTags.slice(0, 12).map((tag) => (
          <button key={tag} type="button" onClick={() => toggleTech(tag)}>
            <Badge
              variant={filters.techStack.includes(tag) ? "default" : "outline"}
              className="cursor-pointer text-xs"
            >
              {tag}
            </Badge>
          </button>
        ))}
        {filters.techStack.length > 0 && (
          <button
            type="button"
            onClick={() => onChange({ ...filters, techStack: [] })}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
    </div>
  );
}