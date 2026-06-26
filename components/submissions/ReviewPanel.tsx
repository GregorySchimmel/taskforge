"use client";

import { useState } from "react";
import { ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import type { Submission } from "@/types";

export function ReviewPanel({
  submission,
  onReview,
}: {
  submission: Submission;
  onReview: (approved: boolean, rating: number, feedback: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [hovered, setHovered] = useState(0);

  if (submission.status !== "pending") {
    return (
      <Card className="border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium capitalize ${submission.status === "approved" ? "text-emerald-400" : "text-rose-400"}`}>
              {submission.status}
            </span>
            {submission.review && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < submission.review!.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                ))}
              </div>
            )}
          </div>
          {submission.review && (
            <p className="mt-2 text-sm text-muted-foreground">&ldquo;{submission.review.feedback}&rdquo;</p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-medium">{submission.devName}</span>
          <span className="text-xs text-muted-foreground">
            {new Date(submission.submittedAt).toLocaleDateString()}
          </span>
        </div>
        <div className="space-y-2 text-sm">
          <a href={submission.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
            GitHub Link <ExternalLink className="h-3 w-3" />
          </a>
          {submission.demoLink && (
            <a href={submission.demoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:underline">
              Demo <ExternalLink className="h-3 w-3" />
            </a>
          )}
          <p className="text-muted-foreground">Time spent: {submission.timeSpentHours}h</p>
          <p className="text-muted-foreground">{submission.notes}</p>
        </div>

        <div>
          <label className="text-sm font-medium">Rating</label>
          <div className="mt-1 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHovered(i + 1)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`Rate ${i + 1} stars`}
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    i < (hovered || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Feedback</label>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Share constructive feedback..."
            className="mt-1"
            rows={3}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onReview(true, rating, feedback || "Great work!")}
          >
            Approve
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onReview(false, rating, feedback || "Needs revision.")}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}