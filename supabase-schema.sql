-- PropertyLens Supabase Schema
-- Run in Supabase SQL Editor

-- Users (extends Supabase auth.users)
create table if not exists public.users (
  id         uuid references auth.users primary key,
  name       text,
  phone      text,
  created_at timestamp default now()
);

-- Conversations
create table if not exists public.conversations (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.users(id),
  messages   jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Saved searches
create table if not exists public.saved_searches (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.users(id),
  query      text,
  filters    jsonb,
  alert_on   boolean default false,
  created_at timestamp default now()
);

-- Saved properties
create table if not exists public.saved_properties (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references public.users(id),
  listing_id text,
  address    text,
  price      integer,
  snapshot   jsonb,
  created_at timestamp default now()
);

-- Leads
create table if not exists public.leads (
  id               uuid default gen_random_uuid() primary key,
  type             text, -- 'tour','cma','recommendation','alert'
  name             text,
  email            text,
  phone            text,
  property_address text,
  message          text,
  conversation     jsonb,
  created_at       timestamp default now()
);

-- RLS policies
alter table public.users           enable row level security;
alter table public.conversations   enable row level security;
alter table public.saved_searches  enable row level security;
alter table public.saved_properties enable row level security;
alter table public.leads           enable row level security;

-- Users can read/write their own data
create policy "users_own" on public.users
  for all using (auth.uid() = id);

create policy "conversations_own" on public.conversations
  for all using (auth.uid() = user_id);

create policy "saved_searches_own" on public.saved_searches
  for all using (auth.uid() = user_id);

create policy "saved_properties_own" on public.saved_properties
  for all using (auth.uid() = user_id);

-- Leads: insert-only for anon (service key used server-side for reads)
create policy "leads_insert" on public.leads
  for insert with check (true);
