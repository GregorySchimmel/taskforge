"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TalentPaywall({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="pointer-events-none select-none blur-sm opacity-60" aria-hidden>
        {children ?? (
          <div className="h-32 rounded-lg bg-secondary/50" />
        )}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-background/80 p-6 text-center backdrop-blur-sm">
        <Lock className="h-8 w-8 text-violet-400" />
        <h3 className="mt-3 font-semibold">Subscribe to view talent</h3>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Employers need an active subscription to browse full profiles, leaderboard details, and contact talent. Posting tasks and reviewing submissions stays free.
        </p>
        <Link href="/employer/subscribe" className="mt-4">
          <Button>View plans</Button>
        </Link>
      </div>
    </div>
  );
}