"use client";

import Link from "next/link";
import { CheckCircle2, Clock, ExternalLink } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculateDevPayout, getPlatformFee, PLATFORM_FEE_PERCENT } from "@/lib/platform-fee";
import { formatCurrency } from "@/lib/utils";
import type { Task } from "@/types";
import { DIFFICULTY_COLORS } from "@/types";

export function TaskModal({
  task,
  open,
  onOpenChange,
  onClaim,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim: () => void;
}) {
  const { user, activeRole, state } = useApp();
  if (!task) return null;

  const project = state.projects.find((p) => p.id === task.projectId);
  const isOwner = user?.id === task.hirerId;
  const devPayout = calculateDevPayout(task.bounty);
  const fee = getPlatformFee(task.bounty);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start gap-2 pr-8">
            <DialogTitle className="text-xl">{task.title}</DialogTitle>
            <Badge className={`shrink-0 border capitalize ${DIFFICULTY_COLORS[task.difficulty]}`}>
              {task.difficulty}
            </Badge>
          </div>
          <DialogDescription>{task.projectName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{task.description}</p>

          <div>
            <h4 className="text-sm font-semibold mb-2">Acceptance Criteria</h4>
            <ul className="space-y-1.5">
              {task.acceptanceCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {task.techTags.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border bg-secondary/30 p-4 text-sm">
            <div>
              <span className="text-muted-foreground">Estimated</span>
              <p className="font-medium flex items-center gap-1"><Clock className="h-4 w-4" /> {task.estimatedHours} hours</p>
            </div>
            <div>
              <span className="text-muted-foreground">Bounty</span>
              {task.bounty > 0 ? (
                <div>
                  <p className="font-medium text-emerald-400">{formatCurrency(devPayout)} to dev</p>
                  <p className="text-xs text-muted-foreground">
                    Hirer pays {formatCurrency(task.bounty)} ({PLATFORM_FEE_PERCENT}% platform fee = {formatCurrency(fee)})
                  </p>
                </div>
              ) : (
                <p className="font-medium text-violet-400">Portfolio Only</p>
              )}
            </div>
          </div>

          {project?.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-indigo-400 hover:underline">
              View parent project <ExternalLink className="h-3 w-3" />
            </a>
          )}

          <div className="flex gap-3 pt-2">
            {activeRole === "talent" && task.status === "open" && (
              <Button onClick={onClaim} className="flex-1">
                {user ? "Claim this task" : "Login to claim"}
              </Button>
            )}
            {isOwner && activeRole === "employer" && (
              <Link href={`/tasks/${task.id}`} className="flex-1" onClick={() => onOpenChange(false)}>
                <Button variant="secondary" className="w-full">View Submissions</Button>
              </Link>
            )}
            <Link href={`/tasks/${task.id}`} onClick={() => onOpenChange(false)}>
              <Button variant="outline">Full Details</Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}