-- Create profiles table
create table if not exists public.profiles (
  id uuid not null references auth.users (id) on delete cascade,
  full_name text null,
  role text not null default 'DONOR',
  organization_name text null,
  created_at timestamp with time zone not null default now(),
  constraint profiles_pkey primary key (id)
);

-- Backfill profiles from auth.users (for existing users)
insert into public.profiles (id, full_name)
select id, raw_user_meta_data->>'full_name'
from auth.users
on conflict (id) do nothing;

-- Create claims table
create table if not exists public.claims (
  id uuid not null default gen_random_uuid (),
  donation_id uuid not null references public.donations (id),
  ngo_id uuid not null references public.profiles (id),
  status text not null default 'PENDING',
  created_at timestamp with time zone not null default now(),
  constraint claims_pkey primary key (id)
);

-- Create tasks table
create table if not exists public.tasks (
  id uuid not null default gen_random_uuid (),
  claim_id uuid not null references public.claims (id),
  volunteer_id uuid null references public.profiles (id),
  status text not null default 'OPEN',
  created_at timestamp with time zone not null default now(),
  constraint tasks_pkey primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.claims enable row level security;
alter table public.tasks enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- Policies for claims (Simplified for demo: Authenticated users can create/view)
create policy "Authenticated users can view claims." on public.claims for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create claims." on public.claims for insert with check (auth.role() = 'authenticated');

-- Policies for tasks
create policy "Authenticated users can view tasks." on public.tasks for select using (auth.role() = 'authenticated');
create policy "Authenticated users can create tasks." on public.tasks for insert with check (auth.role() = 'authenticated');
