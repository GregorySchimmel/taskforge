"use client";

import { motion } from "framer-motion";
import { Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { calculateDevPayout, PLATFORM_FEE_PERCENT } from "@/lib/platform-fee";
import { formatCurrency } from "@/lib/utils";
import type { Task } from "@/types";
import { DIFFICULTY_COLORS } from "@/types";

export function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const devPayout = calculateDevPayout(task.bounty);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className="cursor-pointer border-border/50 bg-card/80 transition-colors hover:border-indigo-500/30 hover:bg-card"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onClick()}
        aria-label={`Task: ${task.title}`}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold leading-tight line-clamp-2">{task.title}</h4>
            <Badge className={`shrink-0 border text-[10px] capitalize ${DIFFICULTY_COLORS[task.difficulty]}`}>
              {task.difficulty}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{task.description}</p>
          <p className="mt-2 text-xs text-indigo-400/80">{task.projectName}</p>
          <div className="mt-3 flex flex-wrap gap-1">
            {task.techTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {task.estimatedHours}h
            </span>
            {task.bounty > 0 ? (
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <DollarSign className="h-3 w-3" />
                {formatCurrency(devPayout)}
                <span className="text-[10px] text-muted-foreground">({PLATFORM_FEE_PERCENT}% fee)</span>
              </span>
            ) : (
              <Badge variant="outline" className="text-[10px] text-violet-400 border-violet-500/30">
                Portfolio Only
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}