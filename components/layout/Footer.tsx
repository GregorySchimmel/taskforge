import Link from "next/link";
import { Anvil, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
                <Anvil className="h-4 w-4 text-white" />
              </div>
              TaskForge
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Forge real skills. Prove your work. Get hired.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tasks" className="hover:text-foreground">Task Board</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground">Leaderboard</Link></li>
              <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm">For Talent</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/tasks" className="hover:text-foreground">Browse Tasks</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground">Top Developers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm">For Employers</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/post" className="hover:text-foreground">Post a Project</Link></li>
              <li><Link href="/leaderboard" className="hover:text-foreground">Find Talent</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">© 2026 TaskForge. Built for the developer community.</p>
          <a href="https://github.com/GregorySchimmel/taskforge" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ExternalLink className="h-4 w-4" /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}