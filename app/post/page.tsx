"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { AITaskSuggestions, type SuggestedTask } from "@/components/post/AITaskSuggestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TASK_TYPES } from "@/types";

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  acceptanceCriteria: z.string(),
  type: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  estimatedHours: z.number().min(1),
  bounty: z.number().min(0),
  techTags: z.string(),
});

const projectSchema = z.object({
  title: z.string().min(3, "Project title required"),
  description: z.string().min(10, "Description required"),
  goals: z.string().min(10, "Goals required"),
  repoUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.string().min(1, "Tech stack required"),
  tasks: z.array(taskSchema).min(1, "Add at least one task"),
});

type FormData = z.infer<typeof projectSchema>;

export default function PostPage() {
  const { user, activeRole, postProject } = useApp();
  const [authOpen, setAuthOpen] = useState(false);
  const [published, setPublished] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      tasks: [{
        title: "", description: "", acceptanceCriteria: "",
        type: "frontend", difficulty: "easy", estimatedHours: 4, bounty: 50, techTags: "",
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "tasks" });

  if (!user || activeRole !== "employer") {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Post a Project</h1>
        <p className="mt-2 text-muted-foreground">
          {!user ? "Log in as an employer to post tasks." : "Switch to Employer view in the header to post tasks."}
        </p>
        <Button className="mt-6" onClick={() => setAuthOpen(true)}>
          {!user ? "Login as Employer" : "Switch to Employer View"}
        </Button>
        <AuthModal open={authOpen} onOpenChange={setAuthOpen} defaultRole="employer" />
      </div>
    );
  }

  if (published) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-emerald-400">Project Published!</h1>
        <p className="mt-2 text-muted-foreground">Your tasks are now live on the Task Board.</p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="/tasks"><Button>View Task Board</Button></a>
          <Button variant="outline" onClick={() => setPublished(false)}>Post Another</Button>
        </div>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    postProject(
      {
        title: data.title,
        description: data.description,
        goals: data.goals,
        repoUrl: data.repoUrl || undefined,
        techStack: data.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      },
      data.tasks.map((t) => ({
        title: t.title,
        description: t.description,
        acceptanceCriteria: t.acceptanceCriteria.split("\n").map((s) => s.trim()).filter(Boolean),
        type: t.type as import("@/types").TaskType,
        difficulty: t.difficulty,
        estimatedHours: t.estimatedHours,
        bounty: t.bounty,
        techTags: t.techTags.split(",").map((s) => s.trim()).filter(Boolean),
      }))
    );
    setPublished(true);
  };

  const handleAISuggestions = (suggestions: SuggestedTask[]) => {
    suggestions.forEach((s) => {
      append({
        title: s.title,
        description: s.description,
        acceptanceCriteria: s.acceptanceCriteria.join("\n"),
        type: s.type,
        difficulty: s.difficulty,
        estimatedHours: s.estimatedHours,
        bounty: s.bounty,
        techTags: s.techTags.join(", "),
      });
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Post a Project</h1>
      <p className="text-sm text-muted-foreground">Create a project and break it into tasks for developers, designers, and creators.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <Card className="border-border/50">
          <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Input placeholder="Project title" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
            </div>
            <div>
              <Textarea placeholder="Project description" {...register("description")} rows={3} />
              {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>}
            </div>
            <div>
              <Textarea placeholder="Project goals" {...register("goals")} rows={2} />
              {errors.goals && <p className="mt-1 text-xs text-rose-400">{errors.goals.message}</p>}
            </div>
            <Input placeholder="GitHub repo URL (optional)" {...register("repoUrl")} />
            <Input placeholder="Tech stack (comma-separated)" {...register("techStack")} />
            {errors.techStack && <p className="mt-1 text-xs text-rose-400">{errors.techStack.message}</p>}
          </CardContent>
        </Card>

        <AITaskSuggestions onAccept={handleAISuggestions} />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => append({
              title: "", description: "", acceptanceCriteria: "",
              type: "frontend", difficulty: "easy", estimatedHours: 4, bounty: 50, techTags: "",
            })} className="gap-1">
              <Plus className="h-3 w-3" /> Add Task
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id} className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Task {index + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(index)} className="text-muted-foreground hover:text-rose-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Input placeholder="Task title" {...register(`tasks.${index}.title`)} />
                <Textarea placeholder="Description" {...register(`tasks.${index}.description`)} rows={2} />
                <Textarea placeholder="Acceptance criteria (one per line)" {...register(`tasks.${index}.acceptanceCriteria`)} rows={2} />
                <div className="grid grid-cols-2 gap-3">
                  <Select {...register(`tasks.${index}.type`)}>
                    {TASK_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </Select>
                  <Select {...register(`tasks.${index}.difficulty`)}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Input type="number" placeholder="Hours" {...register(`tasks.${index}.estimatedHours`)} />
                  <Input type="number" placeholder="Bounty ($)" {...register(`tasks.${index}.bounty`)} />
                  <Input placeholder="Tech tags" {...register(`tasks.${index}.techTags`)} />
                </div>
              </CardContent>
            </Card>
          ))}
          {errors.tasks && <p className="text-xs text-rose-400">{errors.tasks.message ?? errors.tasks.root?.message}</p>}
        </div>

        <Button type="submit" size="lg" className="w-full">Publish Project & Tasks</Button>
      </form>
    </div>
  );
}