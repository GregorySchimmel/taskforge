import type { EmployerSubscription, User } from "@/types";

export const SUBSCRIPTION_PLANS = {
  starter: {
    name: "Starter",
    price: 79,
    features: [
      "Browse full talent profiles",
      "Leaderboard access",
      "5 contact messages / month",
      "Post unlimited tasks (free)",
    ],
  },
  pro: {
    name: "Pro",
    price: 199,
    features: [
      "Everything in Starter",
      "Unlimited contact messages",
      "Saved searches & alerts",
      "Team seats (up to 5)",
    ],
  },
} as const;

export const TRIAL_DAYS = 7;

export function createTrialSubscription(): EmployerSubscription {
  const expires = new Date();
  expires.setDate(expires.getDate() + TRIAL_DAYS);
  return {
    status: "trial",
    plan: null,
    expiresAt: expires.toISOString(),
  };
}

export function createActiveSubscription(plan: "starter" | "pro"): EmployerSubscription {
  const expires = new Date();
  expires.setMonth(expires.getMonth() + 1);
  return {
    status: "active",
    plan,
    expiresAt: expires.toISOString(),
  };
}

export function isSubscriptionValid(sub?: EmployerSubscription): boolean {
  if (!sub) return false;
  if (sub.status === "expired") return false;
  return new Date(sub.expiresAt) > new Date();
}

/** Employers need a valid sub to browse talent profiles & leaderboard details */
export function hasTalentDiscoveryAccess(
  user: User | null,
  activeRole: User["role"]
): boolean {
  if (!user) return false;
  if (activeRole === "talent") return true;
  if (user.role !== "employer") return true;
  return isSubscriptionValid(user.subscription);
}

export function getSubscriptionLabel(sub?: EmployerSubscription): string {
  if (!sub) return "No subscription";
  if (!isSubscriptionValid(sub)) return "Expired";
  if (sub.status === "trial") return `Trial · ends ${new Date(sub.expiresAt).toLocaleDateString()}`;
  return `${SUBSCRIPTION_PLANS[sub.plan ?? "starter"].name} · active`;
}