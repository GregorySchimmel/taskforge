"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { UserRole } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  github: z.string().min(1, "GitHub username required"),
  skills: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AuthModal({
  open,
  onOpenChange,
  defaultRole = "junior",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: UserRole;
}) {
  const { signUp, loginDemo } = useApp();
  const [role, setRole] = useState<UserRole>(defaultRole);
  const [mode, setMode] = useState<"signup" | "demo">("demo");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    signUp({
      name: data.name,
      email: data.email,
      github: data.github,
      role,
      skills: data.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "demo" ? "Quick Demo Login" : "Join TaskForge"}</DialogTitle>
          <DialogDescription>
            {mode === "demo"
              ? "Try the full platform instantly with demo accounts."
              : "Create your account and start building your portfolio."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex rounded-lg border border-border p-1">
          <button
            type="button"
            onClick={() => setRole("junior")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${role === "junior" ? "bg-indigo-600 text-white" : "text-muted-foreground"}`}
          >
            Junior Dev
          </button>
          <button
            type="button"
            onClick={() => setRole("hirer")}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition-colors ${role === "hirer" ? "bg-violet-600 text-white" : "text-muted-foreground"}`}
          >
            Hirer
          </button>
        </div>

        {mode === "demo" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Log in as a pre-seeded {role === "junior" ? "junior developer" : "hirer"} to explore all features. Use the role switcher in the header to demo both sides.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                loginDemo(role);
                onOpenChange(false);
              }}
            >
              Continue as Demo {role === "junior" ? "Developer" : "Hirer"}
            </Button>
            <button type="button" onClick={() => setMode("signup")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              Or create a new account →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input placeholder="Full name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
            </div>
            <div>
              <Input placeholder="Email" type="email" {...register("email")} />
              {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
            </div>
            <div>
              <Input placeholder="GitHub username" {...register("github")} />
              {errors.github && <p className="mt-1 text-xs text-rose-400">{errors.github.message}</p>}
            </div>
            <div>
              <Input placeholder="Skills (comma-separated)" {...register("skills")} />
            </div>
            <Button type="submit" className="w-full">Create Account</Button>
            <button type="button" onClick={() => setMode("demo")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              ← Back to demo login
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}