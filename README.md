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

1. **Browse tasks** — Visit `/tasks` to see the kanban board (dev, web design, video editing columns).
2. **Sign up as Talent** — "For Talent" → pick disciplines (Development, Web Design, Video Editing) → create account.
3. **Or demo login** — "Continue as Demo Talent" (Alex Rivera) or "Demo Employer" (Sarah Chen, has subscription).
4. **Claim & submit** — Claim a task, submit proof on the task detail page.
5. **Switch to Employer** — Header role switcher → review and approve submissions (always free).
6. **Talent discovery paywall** — Log in as "Demo Employer (no subscription)" to see the paywall on `/leaderboard` and `/devs/[username]`.
7. **Subscribe** — Visit `/employer/subscribe` to simulate Stripe checkout and unlock talent browsing.

### Account Types

| Type | Signup | Access |
|------|--------|--------|
| **Talent** | For Talent + discipline picker | Full platform, build verified portfolio |
| **Employer** | For Employers + 7-day trial | Post/review tasks free · Subscribe to browse talent |

### Demo Accounts

| Role | Name | Username | Subscription |
|------|------|----------|--------------|
| Talent | Alex Rivera | `alex-rivera` | — |
| Employer | Sarah Chen | `sarah-chen` | Pro (active) |
| Employer | Marcus Webb | `marcus-webb` | Expired (paywall demo) |

## Features

- **For Talent / For Employers** signup with discipline picker (dev, web design, video editing)
- Task Type Board (12 kanban columns) with search/filters
- Task claim → submit → review → verify flow
- Role-based dashboard (talent stats + employer review queue)
- **Employer subscription** — trial + paywall on leaderboard/profiles (posting tasks stays free)
- Leaderboard with points, badges, discipline tags, hire CTA
- Public talent profiles with verified completions
- Post project + tasks (employer) with mock AI task suggestions
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