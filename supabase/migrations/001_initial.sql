-- TaskForge Supabase schema (for production migration)
-- Run via: supabase db push or paste into Supabase SQL editor

create type user_role as enum ('junior', 'hirer');
create type task_type as enum ('frontend','backend','fullstack','devops','testing','documentation','bugfix','feature','uiux','other');
create type task_difficulty as enum ('easy','medium','hard');
create type task_status as enum ('open','claimed','submitted','completed','verified');
create type submission_status as enum ('pending','approved','rejected');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  name text not null,
  email text not null,
  role user_role not null default 'junior',
  github text not null,
  avatar text,
  bio text,
  skills text[] default '{}',
  location text,
  joined_at timestamptz default now(),
  tasks_completed int default 0,
  total_points int default 0,
  avg_rating numeric(3,2) default 0,
  total_earned int default 0,
  current_streak int default 0
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  hirer_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  goals text not null,
  repo_url text,
  tech_stack text[] default '{}',
  published boolean default true,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) not null,
  hirer_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  acceptance_criteria text[] default '{}',
  type task_type not null,
  difficulty task_difficulty not null,
  estimated_hours int not null,
  bounty int default 0,
  tech_tags text[] default '{}',
  status task_status default 'open',
  claimed_by uuid references profiles(id),
  claimed_at timestamptz,
  deadline timestamptz,
  created_at timestamptz default now()
);

create table submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) not null,
  dev_id uuid references profiles(id) not null,
  github_link text not null,
  demo_link text,
  notes text not null,
  time_spent_hours numeric(4,1) not null,
  submitted_at timestamptz default now(),
  status submission_status default 'pending',
  rating int,
  feedback text,
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz
);

create table verified_completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) not null,
  dev_id uuid references profiles(id) not null,
  task_title text not null,
  project_name text not null,
  task_type task_type not null,
  rating int not null,
  feedback text not null,
  github_link text not null,
  demo_link text,
  completed_at timestamptz default now(),
  bounty_paid int default 0
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) not null,
  type text not null,
  message text not null,
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table submissions enable row level security;
alter table verified_completions enable row level security;
alter table notifications enable row level security;

create policy "Public profiles are viewable" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Public projects" on projects for select using (published = true);
create policy "Hirers manage own projects" on projects for all using (auth.uid() = hirer_id);
create policy "Public open tasks" on tasks for select using (true);
create policy "Devs claim open tasks" on tasks for update using (status = 'open' or claimed_by = auth.uid());
create policy "Hirers manage own tasks" on tasks for all using (auth.uid() = hirer_id);
create policy "Public completions" on verified_completions for select using (true);
create policy "Own notifications" on notifications for select using (auth.uid() = user_id);