"use client";

import Link from "next/link";
import { AlertCircle, Sparkles } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getSubscriptionLabel, isSubscriptionValid } from "@/lib/subscription";
import { Button } from "@/components/ui/button";

export function SubscriptionBanner() {
  const { user, activeRole } = useApp();

  if (!user || activeRole !== "employer" || user.role !== "employer") return null;

  const valid = isSubscriptionValid(user.subscription);
  const isTrial = user.subscription?.status === "trial" && valid;

  if (valid && !isTrial) return null;

  return (
    <div
      className={`border-b px-4 py-2.5 text-sm ${
        valid
          ? "border-indigo-500/30 bg-indigo-500/10 text-indigo-200"
          : "border-amber-500/30 bg-amber-500/10 text-amber-200"
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {valid ? <Sparkles className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>
            {valid
              ? `Free trial active — ${getSubscriptionLabel(user.subscription)}. Subscribe before it ends to keep talent discovery access.`
              : "Your talent discovery access has expired. Subscribe to browse profiles and contact talent."}
          </span>
        </div>
        <Link href="/employer/subscribe">
          <Button size="sm" variant={valid ? "outline" : "default"}>
            {valid ? "Upgrade now" : "Subscribe"}
          </Button>
        </Link>
      </div>
    </div>
  );
}