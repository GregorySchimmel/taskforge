import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types";

const STEPS: { key: TaskStatus; label: string }[] = [
  { key: "claimed", label: "Claimed" },
  { key: "submitted", label: "Submitted" },
  { key: "verified", label: "Verified" },
];

const STATUS_ORDER: Record<string, number> = {
  open: 0,
  claimed: 1,
  submitted: 2,
  completed: 3,
  verified: 3,
};

export function ProgressTracker({ status }: { status: TaskStatus }) {
  const current = STATUS_ORDER[status] ?? 0;

  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        const done = current > i;
        const active = current === i + 1 || (status === "verified" && i === STEPS.length - 1);
        return (
          <div key={step.key} className="flex items-center gap-2">
            {i > 0 && <div className={cn("h-px w-8", done || active ? "bg-indigo-500" : "bg-border")} />}
            <div className="flex items-center gap-1.5">
              {done || (status === "verified") ? (
                <CheckCircle2 className="h-5 w-5 text-indigo-400" />
              ) : active ? (
                <Circle className="h-5 w-5 text-indigo-400 fill-indigo-400/20" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
              <span className={cn("text-sm", (done || active) ? "text-foreground font-medium" : "text-muted-foreground")}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}