-- LaunchBoard Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- Users (extends Supabase auth.users)
-- ============================================
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default '',
  avatar_url text,
  stripe_customer_id text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- Projects (waitlists)
-- ============================================
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  title text not null,
  description text default '',
  logo_url text,
  primary_color text default '#6366f1',
  bg_color text default '#ffffff',
  status text not null default 'active' check (status in ('active', 'paused')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================
-- Subscribers (email signups)
-- ============================================
create table public.subscribers (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  referral_code text unique default encode(gen_random_bytes(4), 'hex'),
  referred_by text,
  referral_count int not null default 0,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Unique: one email per project
alter table public.subscribers
  add constraint subscribers_project_email_unique unique (project_id, email);

-- ============================================
-- Indexes
-- ============================================
create index idx_projects_user_id on public.projects(user_id);
create index idx_projects_slug on public.projects(slug);
create index idx_subscribers_project_id on public.subscribers(project_id);
create index idx_subscribers_created_at on public.subscribers(created_at);
create index idx_subscribers_referral_code on public.subscribers(referral_code);

-- ============================================
-- Row Level Security
-- ============================================
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.subscribers enable row level security;

-- Users policies
create policy "Users can view own profile"
  on public.users for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update using (auth.uid() = id);

-- Projects policies
create policy "Users can view own projects"
  on public.projects for select using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on public.projects for insert with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on public.projects for update using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on public.projects for delete using (auth.uid() = user_id);

-- Public read access for active projects (for /[slug] page)
create policy "Anyone can view active projects by slug"
  on public.projects for select using (status = 'active');

-- Subscribers policies
create policy "Project owners can view subscribers"
  on public.subscribers for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = subscribers.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Project owners can delete subscribers"
  on public.subscribers for delete
  using (
    exists (
      select 1 from public.projects
      where projects.id = subscribers.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Anyone can subscribe"
  on public.subscribers for insert with check (true);

-- ============================================
-- Trigger: auto-create user profile on signup
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- Function: increment referral count
-- ============================================
create or replace function public.increment_referral_count(ref_code text)
returns void as $$
begin
  update public.subscribers
  set referral_count = referral_count + 1
  where referral_code = ref_code;
end;
$$ language plpgsql security definer;
