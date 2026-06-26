"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  githubLink: z.string().url("Valid GitHub/PR URL required"),
  demoLink: z.string().url("Valid URL required").optional().or(z.literal("")),
  timeSpentHours: z.number().min(0.5, "Minimum 0.5 hours"),
  notes: z.string().min(10, "Please add notes about your work"),
});

type FormData = z.infer<typeof schema>;

export function SubmitForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { timeSpentHours: 1 },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">GitHub PR / Commit Link</label>
        <Input placeholder="https://github.com/..." {...register("githubLink")} className="mt-1" />
        {errors.githubLink && <p className="mt-1 text-xs text-rose-400">{errors.githubLink.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Live Demo URL (optional)</label>
        <Input placeholder="https://..." {...register("demoLink")} className="mt-1" />
        {errors.demoLink && <p className="mt-1 text-xs text-rose-400">{errors.demoLink.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Time Spent (hours)</label>
        <Input type="number" step="0.5" {...register("timeSpentHours")} className="mt-1" />
        {errors.timeSpentHours && <p className="mt-1 text-xs text-rose-400">{errors.timeSpentHours.message}</p>}
      </div>
      <div>
        <label className="text-sm font-medium">Notes / What I learned</label>
        <Textarea placeholder="Describe your approach, challenges, and learnings..." {...register("notes")} className="mt-1" rows={4} />
        {errors.notes && <p className="mt-1 text-xs text-rose-400">{errors.notes.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full">
        Submit for Review
      </Button>
    </form>
  );
}