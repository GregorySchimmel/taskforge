"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Anvil,
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  Search,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  { icon: Search, title: "Browse Tasks", desc: "Explore categorized tasks matching your skills on the Task Type Board." },
  { icon: Code2, title: "Claim & Build", desc: "Claim tasks, complete real work, and submit proof via GitHub PRs and demos." },
  { icon: CheckCircle2, title: "Get Verified", desc: "Employers review your work, rate it, and create verified completions on your profile." },
  { icon: Briefcase, title: "Get Hired", desc: "Your living portfolio and leaderboard rank help recruiters discover proven talent." },
];

const testimonials = [
  { name: "Alex Rivera", role: "Fullstack Developer", quote: "TaskForge helped me land my first paid contract. Verified completions beat any resume.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex" },
  { name: "Sarah Chen", role: "Startup CTO", quote: "We get quality work from motivated talent at a fraction of agency costs. The review system builds trust.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah" },
  { name: "Nia Coleman", role: "Web Designer", quote: "Finally a platform where my design work gets verified the same way dev work does. Game changer.", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nia" },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
              <Anvil className="h-4 w-4" />
              For developers, designers & creators
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-balance">
              Forge real skills.{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Prove your work.
              </span>{" "}
              Get hired.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance">
              TaskForge turns completed work into verifiable proof that employers trust — for developers, web designers, video editors, and more.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/tasks">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Join as Talent <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/post">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  For Employers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">How it Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            Four steps from browsing tasks to landing your next opportunity.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/50">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                      <step.icon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="mb-2 text-xs font-medium text-indigo-400">Step {i + 1}</div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Built for Both Sides</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <Card className="border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-transparent">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/20">
                  <Code2 className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold">For Talent</h3>
                <p className="mt-1 text-sm text-muted-foreground">Developers · Web designers · Video editors</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" /> Build a verified portfolio of real accomplishments</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" /> Earn bounties on paid tasks or build portfolio with free ones</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" /> Climb the leaderboard and earn achievement badges</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" /> Get discovered by employers and recruiters</li>
                </ul>
                <Link href="/tasks" className="mt-6 inline-block">
                  <Button>Browse Tasks</Button>
                </Link>
              </CardContent>
            </Card>
            <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
              <CardContent className="p-8">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/20">
                  <Users className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-bold">For Employers</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Post tasks free — pay bounties only when work is done</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Review submissions with ratings and feedback</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Subscribe to browse talent profiles & leaderboard</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" /> Discover proven developers, designers & editors</li>
                </ul>
                <Link href="/post" className="mt-6 inline-block">
                  <Button variant="secondary">Post a Project</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Trusted by Talent & Employers</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50">
                <CardContent className="p-6">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full bg-secondary" />
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Award className="mx-auto h-12 w-12 text-indigo-400" />
          <h2 className="mt-4 text-3xl font-bold">Ready to prove what you can build?</h2>
          <p className="mt-3 text-muted-foreground">Join developers, designers, and creators building verifiable portfolios on TaskForge.</p>
          <Link href="/tasks" className="mt-8 inline-block">
            <Button size="lg" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}