"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Mail, Trophy } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { getBadgesForDev } from "@/lib/badges";
import { formatCurrency } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { User } from "@/types";

export default function LeaderboardPage() {
  const { leaderboard, state } = useApp();
  const [period, setPeriod] = useState("all");
  const [minTasks, setMinTasks] = useState(0);
  const [hireTarget, setHireTarget] = useState<User | null>(null);

  const filtered = useMemo(() => {
    return leaderboard.filter((u) => u.stats.tasksCompleted >= minTasks);
  }, [leaderboard, minTasks]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">Top junior developers ranked by verified points</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} aria-label="Time period">
          <option value="all">All Time</option>
          <option value="month">This Month</option>
          <option value="week">This Week</option>
        </Select>
        <Select value={minTasks} onChange={(e) => setMinTasks(Number(e.target.value))} aria-label="Minimum tasks">
          <option value={0}>Any Tasks</option>
          <option value={3}>3+ Tasks</option>
          <option value={5}>5+ Tasks</option>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((dev, i) => {
          const completions = state.verifiedCompletions.filter((c) => c.devId === dev.id);
          const badges = getBadgesForDev(completions);
          const rank = i + 1;

          return (
            <motion.div
              key={dev.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={`border-border/50 ${rank <= 3 ? "border-amber-500/20 bg-amber-500/5" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-lg font-bold w-8 text-center ${rank <= 3 ? "text-amber-400" : "text-muted-foreground"}`}>
                        #{rank}
                      </span>
                      <Link href={`/devs/${dev.username}`}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={dev.avatar} alt={dev.name} />
                          <AvatarFallback>{dev.name[0]}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <Link href={`/devs/${dev.username}`} className="font-semibold hover:text-indigo-400 transition-colors">
                          {dev.name}
                        </Link>
                        <a
                          href={`https://github.com/${dev.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          @{dev.github} <ExternalLink className="h-3 w-3" />
                        </a>
                        {badges.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {badges.slice(0, 3).map((b) => (
                              <Badge key={b.id} variant="outline" className="text-[10px] px-1.5">
                                {b.icon} {b.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-bold">{dev.stats.tasksCompleted}</p>
                        <p className="text-xs text-muted-foreground">Tasks</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-indigo-400">{dev.stats.totalPoints}</p>
                        <p className="text-xs text-muted-foreground">Points</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold">{dev.stats.avgRating ? dev.stats.avgRating.toFixed(1) : "—"}</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-emerald-400">{formatCurrency(dev.stats.totalEarned)}</p>
                        <p className="text-xs text-muted-foreground">Earned</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => setHireTarget(dev)} className="gap-1">
                        <Mail className="h-3 w-3" /> Hire
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={!!hireTarget} onOpenChange={() => setHireTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hire {hireTarget?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This is a simulated contact flow. In production, this would open an email composer or in-app messaging.
          </p>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm">
            <p><strong>Email:</strong> {hireTarget?.email}</p>
            <p><strong>GitHub:</strong> github.com/{hireTarget?.github}</p>
            <p className="mt-2 text-muted-foreground">
              &ldquo;Hi {hireTarget?.name}, I saw your verified work on TaskForge and would love to discuss opportunities...&rdquo;
            </p>
          </div>
          <Button className="w-full" onClick={() => setHireTarget(null)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}