"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Code2, Film, Palette, Users } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { TALENT_DISCIPLINES } from "@/lib/disciplines";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { TalentDiscipline, UserRole } from "@/types";

const DISCIPLINE_ICONS = {
  development: Code2,
  web_design: Palette,
  video_editing: Film,
};

const schema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  portfolioUrl: z.string().min(2, "Portfolio link required"),
  companyName: z.string().optional(),
  skills: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function AuthModal({
  open,
  onOpenChange,
  defaultRole = "talent",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultRole?: UserRole;
}) {
  const { signUp, loginDemo } = useApp();
  const [accountType, setAccountType] = useState<UserRole>(defaultRole);
  const [mode, setMode] = useState<"signup" | "demo">("demo");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [disciplines, setDisciplines] = useState<TalentDiscipline[]>(["development"]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const toggleDiscipline = (d: TalentDiscipline) => {
    setDisciplines((prev) =>
      prev.includes(d) ? (prev.length > 1 ? prev.filter((x) => x !== d) : prev) : [...prev, d]
    );
  };

  const portfolioMeta = TALENT_DISCIPLINES.find((x) => x.value === disciplines[0])!;

  const onSubmit = (data: FormData) => {
    const portfolioUrl =
      data.portfolioUrl ||
      (accountType === "employer" && data.companyName
        ? `https://${data.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`
        : "");
    signUp({
      name: data.name,
      email: data.email,
      role: accountType,
      portfolioUrl,
      skills: data.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
      disciplines: accountType === "talent" ? disciplines : undefined,
      companyName: accountType === "employer" ? data.companyName : undefined,
    });
    onOpenChange(false);
    setStep(1);
  };

  const reset = () => {
    setStep(1);
    setMode("demo");
    setAccountType(defaultRole);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "demo" ? "Quick Demo Login" : step === 1 ? "Join TaskForge" : step === 2 ? (accountType === "talent" ? "Your disciplines" : "Company info") : "Your profile"}
          </DialogTitle>
          <DialogDescription>
            {mode === "demo"
              ? "Try the platform instantly with demo accounts."
              : step === 1
                ? "Choose whether you're here to build your portfolio or hire talent."
                : accountType === "talent"
                  ? "Select the skills you want to prove with verified work."
                  : "New employers get a 7-day free trial to browse talent."}
          </DialogDescription>
        </DialogHeader>

        {mode === "demo" ? (
          <div className="space-y-4">
            <div className="flex rounded-lg border border-border p-1">
              <button
                type="button"
                onClick={() => setAccountType("talent")}
                className={cn("flex-1 rounded-md py-2 text-sm font-medium transition-colors", accountType === "talent" ? "bg-indigo-600 text-white" : "text-muted-foreground")}
              >
                For Talent
              </button>
              <button
                type="button"
                onClick={() => setAccountType("employer")}
                className={cn("flex-1 rounded-md py-2 text-sm font-medium transition-colors", accountType === "employer" ? "bg-violet-600 text-white" : "text-muted-foreground")}
              >
                For Employers
              </button>
            </div>
            <Button className="w-full" onClick={() => { loginDemo(accountType); onOpenChange(false); }}>
              Continue as Demo {accountType === "talent" ? "Talent" : "Employer"}
            </Button>
            {accountType === "employer" && (
              <Button variant="outline" className="w-full" onClick={() => { loginDemo("employer", "no_sub"); onOpenChange(false); }}>
                Demo Employer (no subscription — see paywall)
              </Button>
            )}
            <button type="button" onClick={() => setMode("signup")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
              Or create a new account →
            </button>
          </div>
        ) : step === 1 ? (
          <div className="grid gap-3">
            <button
              type="button"
              onClick={() => { setAccountType("talent"); setStep(2); }}
              className="flex items-start gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                <Code2 className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-semibold">For Talent</p>
                <p className="text-sm text-muted-foreground">Developers, web designers, video editors — build a verified portfolio</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => { setAccountType("employer"); setStep(2); }}
              className="flex items-start gap-4 rounded-lg border border-border p-4 text-left transition-colors hover:border-violet-500/40 hover:bg-violet-500/5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                <Users className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="font-semibold">For Employers</p>
                <p className="text-sm text-muted-foreground">Post tasks free · Subscribe to discover and hire proven talent</p>
              </div>
            </button>
            <button type="button" onClick={() => setMode("demo")} className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to demo login
            </button>
          </div>
        ) : step === 2 && accountType === "talent" ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              {TALENT_DISCIPLINES.map((d) => {
                const Icon = DISCIPLINE_ICONS[d.value];
                const selected = disciplines.includes(d.value);
                return (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => toggleDiscipline(d.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                      selected ? "border-indigo-500/50 bg-indigo-500/10" : "border-border hover:bg-secondary/50"
                    )}
                  >
                    <Icon className={cn("h-5 w-5", selected ? "text-indigo-400" : "text-muted-foreground")} />
                    <div>
                      <p className="text-sm font-medium">{d.label}</p>
                      <p className="text-xs text-muted-foreground">{d.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <Button className="w-full" onClick={() => setStep(3)}>Continue</Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-muted-foreground">← Back</button>
          </div>
        ) : step === 2 && accountType === "employer" ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
              Includes a <strong>7-day free trial</strong> to browse talent profiles and leaderboard. Posting tasks and reviewing work is always free.
            </p>
            <Button className="w-full" onClick={() => setStep(3)}>Continue</Button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-muted-foreground">← Back</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input placeholder="Full name" {...register("name")} />
            {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            <Input placeholder="Email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
            {accountType === "employer" && (
              <>
                <Input placeholder="Company name" {...register("companyName")} />
              </>
            )}
            <div>
              <label className="text-xs text-muted-foreground">
                {accountType === "talent" ? portfolioMeta.portfolioLabel : "Company website (optional)"}
              </label>
              <Input
                placeholder={accountType === "talent" ? portfolioMeta.portfolioPlaceholder : "https://yourcompany.com"}
                {...register("portfolioUrl")}
                className="mt-1"
              />
              {errors.portfolioUrl && <p className="mt-1 text-xs text-rose-400">{errors.portfolioUrl.message}</p>}
            </div>
            {accountType === "talent" && (
              <Input placeholder="Skills (comma-separated)" {...register("skills")} />
            )}
            <Button type="submit" className="w-full">Create Account</Button>
            <button type="button" onClick={() => setStep(2)} className="w-full text-sm text-muted-foreground">← Back</button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}