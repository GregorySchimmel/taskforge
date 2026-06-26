"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, CreditCard } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { SUBSCRIPTION_PLANS } from "@/lib/subscription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/*
 * PRODUCTION: Wire to Stripe Checkout
 *
 * const session = await fetch('/api/stripe/checkout', {
 *   method: 'POST',
 *   body: JSON.stringify({ plan: 'starter' | 'pro' }),
 * });
 * window.location.href = session.url;
 */

export default function SubscribePage() {
  const { user, activeRole, subscribe } = useApp();
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubscribe = async (plan: "starter" | "pro") => {
    setLoading(plan);
    await new Promise((r) => setTimeout(r, 800));
    subscribe(plan);
    setLoading(null);
    setDone(true);
  };

  if (!user || user.role !== "employer") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Employer Subscription</h1>
        <p className="mt-2 text-muted-foreground">Log in as an employer to subscribe.</p>
        <Link href="/tasks"><Button className="mt-6">Back to app</Button></Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Subscription activated!</h1>
        <p className="mt-2 text-muted-foreground">You now have full access to browse talent and send contact requests.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/leaderboard"><Button>Browse Leaderboard</Button></Link>
          <Link href="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Discover proven talent</h1>
        <p className="mt-2 text-muted-foreground">
          Post tasks free. Subscribe to browse full profiles, leaderboard rankings, and contact talent.
        </p>
        {activeRole === "employer" && user.subscription && (
          <p className="mt-2 text-sm text-indigo-400">
            Current: {user.subscription.status === "active" ? `${user.subscription.plan} plan` : user.subscription.status}
          </p>
        )}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {(["starter", "pro"] as const).map((planId) => {
          const plan = SUBSCRIPTION_PLANS[planId];
          return (
            <Card
              key={planId}
              className={`border-border/50 ${planId === "pro" ? "border-violet-500/30 bg-violet-500/5" : ""}`}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  <span className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full gap-2"
                  variant={planId === "pro" ? "default" : "outline"}
                  disabled={!!loading}
                  onClick={() => handleSubscribe(planId)}
                >
                  <CreditCard className="h-4 w-4" />
                  {loading === planId ? "Processing..." : `Subscribe to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Simulated payment for demo. Production: integrate Stripe Checkout with webhook to activate subscription.
      </p>
    </div>
  );
}