"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { SubmitForm } from "@/components/submissions/SubmitForm";
import { ReviewPanel } from "@/components/submissions/ReviewPanel";
import { ProgressTracker } from "@/components/tasks/ProgressTracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateDevPayout, PLATFORM_FEE_PERCENT } from "@/lib/platform-fee";
import { formatCurrency } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/types";
import { useState } from "react";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state, user, activeRole, claimTaskById, submitTaskWork, reviewTaskSubmission } = useApp();
  const [authOpen, setAuthOpen] = useState(false);

  const task = state.tasks.find((t) => t.id === id);
  if (!task) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Task not found</h1>
        <Link href="/tasks"><Button className="mt-4">Back to Board</Button></Link>
      </div>
    );
  }

  const submissions = state.submissions.filter((s) => s.taskId === task.id);
  const isClaimer = user?.id === task.claimedBy;
  const isOwner = user?.id === task.hirerId;
  const devPayout = calculateDevPayout(task.bounty);

  const handleSubmit = (data: { githubLink: string; demoLink?: string; notes: string; timeSpentHours: number }) => {
    submitTaskWork(task.id, {
      githubLink: data.githubLink,
      demoLink: data.demoLink || undefined,
      notes: data.notes,
      timeSpentHours: data.timeSpentHours,
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to board
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="mt-1 text-muted-foreground">{task.projectName}</p>
        </div>
        <Badge className={`border capitalize ${DIFFICULTY_COLORS[task.difficulty]}`}>{task.difficulty}</Badge>
      </div>

      {task.status !== "open" && (
        <div className="mt-6">
          <ProgressTracker status={task.status} />
        </div>
      )}

      <Card className="mt-6 border-border/50">
        <CardContent className="p-6 space-y-4">
          <p className="leading-relaxed">{task.description}</p>
          <div>
            <h3 className="font-semibold text-sm mb-2">Acceptance Criteria</h3>
            <ul className="space-y-1">
              {task.acceptanceCriteria.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />{c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            {task.techTags.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground">Estimated:</span> {task.estimatedHours}h</div>
            <div>
              {task.bounty > 0 ? (
                <span className="text-emerald-400 font-medium">
                  {formatCurrency(devPayout)} payout ({PLATFORM_FEE_PERCENT}% fee)
                </span>
              ) : (
                <span className="text-violet-400 font-medium">Portfolio Only</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {activeRole === "junior" && task.status === "open" && (
        <Button
          className="mt-6 w-full"
          onClick={() => user ? claimTaskById(task.id) : setAuthOpen(true)}
        >
          Claim this task
        </Button>
      )}

      {isClaimer && activeRole === "junior" && (task.status === "claimed" || task.status === "submitted") && (
        <Card className="mt-6 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Submit Completion</CardTitle>
          </CardHeader>
          <CardContent>
            {task.status === "claimed" ? (
              <SubmitForm onSubmit={handleSubmit} />
            ) : (
              <p className="text-sm text-muted-foreground">Your submission is pending review. Check back soon!</p>
            )}
          </CardContent>
        </Card>
      )}

      {isOwner && activeRole === "hirer" && submissions.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">Submissions ({submissions.length})</h2>
          {submissions.map((sub) => (
            <ReviewPanel
              key={sub.id}
              submission={sub}
              onReview={(approved, rating, feedback) =>
                reviewTaskSubmission(sub.id, approved, rating, feedback)
              }
            />
          ))}
        </div>
      )}

      {isOwner && activeRole === "hirer" && submissions.length === 0 && task.status !== "open" && (
        <p className="mt-6 text-sm text-muted-foreground">No submissions yet. Waiting for the developer to submit work.</p>
      )}

      <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultRole="junior" />
    </div>
  );
}