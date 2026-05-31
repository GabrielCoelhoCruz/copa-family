-- Users (guest-based, no auth required)
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  avatar_key text not null default 'default',
  created_at timestamptz not null default now()
);

-- Rooms
create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  owner_user_id uuid not null references public.users(id),
  created_at timestamptz not null default now()
);

-- Room members
create table if not exists public.room_members (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.users(id),
  role text not null default 'member' check (role in ('owner', 'member')),
  joined_at timestamptz not null default now(),
  unique(room_id, user_id)
);

-- Matches
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  title text not null default 'Partida',
  status text not null default 'lobby' check (
    status in ('lobby', 'predictions_open', 'live', 'halftime', 'finished')
  ),
  home_score int,
  away_score int,
  winner text,
  player_of_match text,
  started_at timestamptz,
  halftime_started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

-- Predictions
create table if not exists public.predictions (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  user_id uuid not null references public.users(id),
  winner text,
  home_score int,
  away_score int,
  player_of_match text,
  submitted_at timestamptz not null default now(),
  unique(match_id, user_id)
);

-- Points
create table if not exists public.points (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  match_id uuid references public.matches(id) on delete cascade,
  user_id uuid not null references public.users(id),
  source text not null,
  amount int not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_room_members_room_id on public.room_members(room_id);
create index if not exists idx_room_members_user_id on public.room_members(user_id);
create index if not exists idx_matches_room_id on public.matches(room_id);
create index if not exists idx_predictions_match_id on public.predictions(match_id);
create index if not exists idx_points_room_id on public.points(room_id);
create index if not exists idx_points_user_id on public.points(user_id);

-- Enable RLS (Row Level Security)
alter table public.users enable row level security;
alter table public.rooms enable row level security;
alter table public.room_members enable row level security;
alter table public.matches enable row level security;
alter table public.predictions enable row level security;
alter table public.points enable row level security;

-- Permissive policies for MVP (anon can read/write everything)
create policy "allow_all_users" on public.users for all using (true) with check (true);
create policy "allow_all_rooms" on public.rooms for all using (true) with check (true);
create policy "allow_all_room_members" on public.room_members for all using (true) with check (true);
create policy "allow_all_matches" on public.matches for all using (true) with check (true);
create policy "allow_all_predictions" on public.predictions for all using (true) with check (true);
create policy "allow_all_points" on public.points for all using (true) with check (true);
