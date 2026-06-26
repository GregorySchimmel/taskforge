"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, MapPin, Star, Mail } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { TalentPaywall } from "@/components/employer/TalentPaywall";
import { getBadgesForDev } from "@/lib/badges";
import { getDisciplineLabel } from "@/lib/disciplines";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function getTalentTitle(dev: { disciplines?: string[]; skills: string[] }): string {
  if (dev.disciplines?.includes("video_editing")) return "Video Editor";
  if (dev.disciplines?.includes("web_design")) return "Web Designer";
  if (dev.disciplines?.includes("development")) return `${dev.skills[0] ?? "Software"} Developer`;
  return dev.skills[0] ?? "Creative Professional";
}

export default function DevProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { getUserByUsername, state, user, updateSkills, canDiscoverTalent } = useApp();
  const [editingSkills, setEditingSkills] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [contactOpen, setContactOpen] = useState(false);

  const dev = getUserByUsername(username);
  if (!dev) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  const isOwner = user?.id === dev.id;
  const showPaywall = !isOwner && !canDiscoverTalent;

  const completions = state.verifiedCompletions.filter((c) => c.devId === dev.id);
  const badges = getBadgesForDev(completions);

  const handleSaveSkills = () => {
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
    updateSkills(skills);
    setEditingSkills(false);
  };

  const profileContent = (
    <>
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-indigo-500/10 via-card to-violet-500/10 p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={dev.avatar} alt={dev.name} />
            <AvatarFallback className="text-2xl">{dev.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{dev.name}</h1>
            <p className="text-muted-foreground">{getTalentTitle(dev)}</p>
            {dev.disciplines && dev.disciplines.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-1 sm:justify-start">
                {dev.disciplines.map((d) => (
                  <Badge key={d} variant="secondary" className="text-xs">{getDisciplineLabel(d)}</Badge>
                ))}
              </div>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              <a href={dev.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                <ExternalLink className="h-3 w-3" /> Portfolio
              </a>
              {dev.location && (
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {dev.location}</span>
              )}
              <span>Joined {formatDate(dev.joinedAt)}</span>
            </div>
            {dev.bio && <p className="mt-3 text-sm">{dev.bio}</p>}
          </div>
          {!isOwner && canDiscoverTalent && (
            <Button variant="outline" className="gap-1" onClick={() => setContactOpen(true)}>
              <Mail className="h-4 w-4" /> Contact for opportunities
            </Button>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Tasks Completed", value: dev.stats.tasksCompleted },
            { label: "Total Points", value: dev.stats.totalPoints },
            { label: "Avg Rating", value: dev.stats.avgRating ? dev.stats.avgRating.toFixed(1) : "—" },
            { label: "Total Earned", value: formatCurrency(dev.stats.totalEarned) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-secondary/50 p-3 text-center">
              <p className="text-lg font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Skills</h2>
          {isOwner && !editingSkills && (
            <Button variant="ghost" size="sm" onClick={() => { setSkillsInput(dev.skills.join(", ")); setEditingSkills(true); }}>
              Edit
            </Button>
          )}
        </div>
        {editingSkills ? (
          <div className="mt-2 flex gap-2">
            <Input value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, Figma, Premiere Pro" />
            <Button size="sm" onClick={handleSaveSkills}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => setEditingSkills(false)}>Cancel</Button>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {dev.skills.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
          </div>
        )}
      </div>

      {badges.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Achievement Badges</h2>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <Badge key={b.id} variant="outline" className="gap-1 px-3 py-1">
                <span>{b.icon}</span> {b.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <h2 className="mt-8 text-lg font-semibold">Verified Completions</h2>
      {completions.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No verified completions yet.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {completions.map((vc) => (
            <Card key={vc.id} className="border-border/50">
              <CardContent className="p-4">
                <h3 className="font-medium">{vc.taskTitle}</h3>
                <p className="text-xs text-muted-foreground">{vc.projectName}</p>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < vc.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-muted-foreground italic">&ldquo;{vc.feedback}&rdquo;</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex gap-2">
                    <a href={vc.githubLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Proof</a>
                    {vc.demoLink && (
                      <a href={vc.demoLink} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Demo</a>
                    )}
                  </div>
                  <span className="text-muted-foreground">{formatDate(vc.completedAt)}</span>
                </div>
                {vc.bountyPaid > 0 && (
                  <p className="mt-1 text-xs text-emerald-400">Earned {formatCurrency(vc.bountyPaid)}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {showPaywall ? (
        <TalentPaywall>
          <div className="rounded-xl border border-border p-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={dev.avatar} alt={dev.name} />
                <AvatarFallback>{dev.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold">{dev.name}</h1>
                <p className="text-muted-foreground">{getTalentTitle(dev)}</p>
                <p className="text-sm text-muted-foreground">{dev.stats.tasksCompleted} verified tasks · {dev.stats.totalPoints} pts</p>
              </div>
            </div>
          </div>
        </TalentPaywall>
      ) : (
        profileContent
      )}

      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {dev.name}</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-secondary/30 p-4 text-sm">
            <p><strong>Email:</strong> {dev.email}</p>
            <p><strong>Portfolio:</strong> {dev.portfolioUrl}</p>
          </div>
          <Button onClick={() => setContactOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}