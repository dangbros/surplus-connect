-- Create the donations table
create table public.donations (
  id uuid not null default gen_random_uuid (),
  donor_id uuid not null references auth.users (id),
  food_category text not null,
  weight_kg numeric not null,
  pickup_instructions text not null,
  expiry_at timestamp with time zone not null,
  image_url text null,
  status text not null default 'AVAILABLE'::text,
  created_at timestamp with time zone not null default now(),
  constraint donations_pkey primary key (id)
);

-- Enable RLS
alter table public.donations enable row level security;

-- Create policies
create policy "Public donations are viewable by everyone." on public.donations for
select
  using (true);

create policy "Users can insert their own donations." on public.donations for insert
with
  check (auth.uid () = donor_id);

create policy "Users can update their own donations." on public.donations for update
using (auth.uid () = donor_id);

-- Create the storage bucket for food images
insert into storage.buckets (id, name, public)
values ('food-images', 'food-images', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Food images are publicly accessible." on storage.objects for
select
  using (bucket_id = 'food-images');

create policy "Users can upload food images." on storage.objects for insert
with
  check (
    bucket_id = 'food-images'
    and auth.uid () = owner
  );
