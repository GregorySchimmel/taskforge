"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Flame,
  LayoutDashboard,
  Plus,
  Star,
  Trophy,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { TaskCard } from "@/components/tasks/TaskCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { user, activeRole, state } = useApp();

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Your Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Log in to see your tasks, stats, and reviews.</p>
        <Link href="/tasks"><Button className="mt-6">Browse Tasks</Button></Link>
      </div>
    );
  }

  if (activeRole === "junior") {
    const myTasks = state.tasks.filter((t) => t.claimedBy === user.id);
    const columns = [
      { label: "Claimed", status: "claimed" as const },
      { label: "Submitted", status: "submitted" as const },
      { label: "Verified", status: "verified" as const },
    ];

    const stats = [
      { label: "Tasks Completed", value: user.stats.tasksCompleted, icon: CheckCircle2, color: "text-emerald-400" },
      { label: "Current Streak", value: user.stats.currentStreak, icon: Flame, color: "text-orange-400" },
      { label: "Total Earned", value: formatCurrency(user.stats.totalEarned), icon: DollarSign, color: "text-green-400" },
      { label: "Avg Rating", value: user.stats.avgRating ? user.stats.avgRating.toFixed(1) : "—", icon: Star, color: "text-amber-400" },
    ];

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Welcome back, {user.name}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{s.label}</span>
                    <s.icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <p className="mt-2 text-2xl font-bold">{s.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Link href={`/devs/${user.username}`}><Button variant="outline" size="sm">View Profile</Button></Link>
          <Link href="/leaderboard"><Button variant="outline" size="sm" className="gap-1"><Trophy className="h-4 w-4" /> Leaderboard</Button></Link>
        </div>

        <h2 className="mt-8 text-lg font-semibold">My Tasks</h2>
        {myTasks.length === 0 ? (
          <Card className="mt-4 border-border/50">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No claimed tasks yet.</p>
              <Link href="/tasks"><Button className="mt-4">Browse Task Board</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.label}>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">{col.label}</h3>
                <div className="space-y-3">
                  {myTasks.filter((t) => t.status === col.status).map((task) => (
                    <Link key={task.id} href={`/tasks/${task.id}`}>
                      <TaskCard task={task} onClick={() => {}} />
                    </Link>
                  ))}
                  {myTasks.filter((t) => t.status === col.status).length === 0 && (
                    <p className="py-4 text-center text-xs text-muted-foreground">None</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Hirer view
  const myProjects = state.projects.filter((p) => p.hirerId === user.id);
  const myTasks = state.tasks.filter((t) => t.hirerId === user.id);
  const pendingReviews = state.submissions.filter(
    (s) => s.status === "pending" && myTasks.some((t) => t.id === s.taskId)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Hirer Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage projects and review submissions</p>
        </div>
        <Link href="/post"><Button className="gap-1"><Plus className="h-4 w-4" /> Post New Task</Button></Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50">
          <CardContent className="p-4">
            <span className="text-sm text-muted-foreground">Projects</span>
            <p className="mt-1 text-2xl font-bold">{myProjects.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <span className="text-sm text-muted-foreground">Active Tasks</span>
            <p className="mt-1 text-2xl font-bold">{myTasks.filter((t) => t.status !== "verified").length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4">
            <span className="text-sm text-muted-foreground">Pending Reviews</span>
            <p className="mt-1 text-2xl font-bold text-amber-400">{pendingReviews.length}</p>
          </CardContent>
        </Card>
      </div>

      {pendingReviews.length > 0 && (
        <Card className="mt-6 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" /> Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReviews.map((sub) => {
              const task = myTasks.find((t) => t.id === sub.taskId);
              return (
                <Link key={sub.id} href={`/tasks/${sub.taskId}`} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50 transition-colors">
                  <div>
                    <p className="font-medium text-sm">{task?.title}</p>
                    <p className="text-xs text-muted-foreground">by {sub.devName}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      )}

      <h2 className="mt-8 text-lg font-semibold">Your Tasks</h2>
      <div className="mt-4 space-y-2">
        {myTasks.slice(0, 10).map((task) => (
          <Link key={task.id} href={`/tasks/${task.id}`} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-secondary/50">
            <div>
              <p className="text-sm font-medium">{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.projectName}</p>
            </div>
            <Badge variant="outline" className="capitalize text-xs">{task.status}</Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}