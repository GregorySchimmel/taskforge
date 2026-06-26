# TaskForge

**Forge real skills. Prove your work. Get hired.**

TaskForge helps junior developers turn completed work into verifiable proof that leads to real jobs and income.

**Repository:** https://github.com/GregorySchimmel/taskforge

## Quick Start

```bash
git clone https://github.com/GregorySchimmel/taskforge.git
cd taskforge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No database or API keys required — the MVP uses seeded data with localStorage persistence.

## Demo Walkthrough

1. **Browse tasks** — Visit `/tasks` to see the kanban-style Task Type Board with 28 seeded tasks.
2. **Login as Junior Dev** — Click "Join as Dev" → "Continue as Demo Developer" (logs in as Alex Rivera).
3. **Claim tasks** — Click any open task card → "Claim this task".
4. **Submit work** — Go to `/tasks/[id]` → fill in GitHub link, notes, time spent → Submit for Review.
5. **Switch to Hirer** — Use the role switcher in the header → "Hirer".
6. **Review submissions** — Log in as Demo Hirer (Sarah Chen) or stay logged in and switch roles. Visit the task detail page → Approve with rating and feedback.
7. **See updates** — Check `/leaderboard`, `/devs/alex-rivera`, and `/dashboard` for updated stats and verified completions.

### Role Switcher

The header role switcher lets one person demo both Junior Dev and Hirer flows without logging out. Switch freely between views.

### Demo Accounts

| Role | Name | Username |
|------|------|----------|
| Junior Dev | Alex Rivera | `alex-rivera` |
| Hirer | Sarah Chen | `sarah-chen` |

## Features

- Landing page with hero, how-it-works, benefits, testimonials
- Task Type Board (10 kanban columns) with search/filters
- Task claim → submit → review → verify flow
- Role-based dashboard (dev stats + hirer review queue)
- Leaderboard with points, badges, hire CTA
- Public dev profiles with verified completions
- Post project + tasks (hirer) with mock AI task suggestions
- In-app notifications, achievement badges, 10% platform fee display

## Tech Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui-style components
- Framer Motion, react-hook-form + zod, sonner
- localStorage state persistence (demo mode)
- Supabase schema ready for production (`supabase/migrations/`)

## Production Next Steps

### Database (Supabase)

1. Create a Supabase project
2. Run `supabase/migrations/001_initial.sql`
3. Copy `.env.local.example` → `.env.local` with your keys
4. Replace `lib/store` calls with Supabase client queries

### Payments (Stripe)

- Use Stripe Connect for bounty payouts
- Hirer pays full bounty; platform takes 10% fee
- Dev receives payout on submission approval webhook

### AI Task Breakdown

See commented example in `components/post/AITaskSuggestions.tsx`. Wire to `/api/suggest-tasks` with your LLM of choice.

### Notifications

- Email via Resend/SendGrid on task claimed, submission received, review complete
- Push notifications for mobile companion

## Project Structure

```
app/           # Pages (landing, tasks, dashboard, leaderboard, profiles, post)
components/    # UI, layout, task board, submissions, auth
contexts/      # AppContext (auth, state, role switching)
data/          # Seed data
lib/           # Store, points, badges, utils, Supabase clients
types/         # TypeScript interfaces
supabase/      # SQL migrations
```