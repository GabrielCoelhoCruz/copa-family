-- World Cup catalog: reusable teams, venues, sync audit, fixture refs

create table if not exists public.football_teams (
  id uuid primary key default gen_random_uuid(),
  season integer not null,
  name text not null,
  short_name text,
  slug text not null,
  country_code text,
  flag_url text,
  badge_url text,
  group_name text,
  is_qualified boolean not null default true,
  provider_refs jsonb not null default '{}'::jsonb,
  raw_sources jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season, slug)
);

create index if not exists idx_football_teams_season_group
  on public.football_teams (season, group_name);

create table if not exists public.football_venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  timezone text,
  slug text not null unique,
  provider_refs jsonb not null default '{}'::jsonb,
  raw_sources jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.football_data_sync_runs (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  mode text not null,
  season integer not null,
  status text not null default 'running'
    check (status in ('running', 'completed', 'failed')),
  rows_fetched integer not null default 0,
  rows_upserted integer not null default 0,
  warnings jsonb not null default '[]'::jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists idx_football_data_sync_runs_started
  on public.football_data_sync_runs (started_at desc);

alter table public.football_fixtures
  add column if not exists home_team_ref uuid references public.football_teams (id) on delete set null,
  add column if not exists away_team_ref uuid references public.football_teams (id) on delete set null,
  add column if not exists venue_ref uuid references public.football_venues (id) on delete set null,
  add column if not exists source_priority integer not null default 0,
  add column if not exists data_confidence text not null default 'provider'
    check (data_confidence in ('provider', 'manual', 'verified')),
  add column if not exists last_verified_at timestamptz;

create index if not exists idx_football_fixtures_home_team_ref
  on public.football_fixtures (home_team_ref);

create index if not exists idx_football_fixtures_away_team_ref
  on public.football_fixtures (away_team_ref);

create index if not exists idx_football_fixtures_group_name
  on public.football_fixtures (group_name);

alter table public.football_teams enable row level security;
alter table public.football_venues enable row level security;
alter table public.football_data_sync_runs enable row level security;

create policy "football_teams_select_all"
  on public.football_teams
  for select
  using (true);

create policy "football_venues_select_all"
  on public.football_venues
  for select
  using (true);

-- Sync runs are server-only; no public select policy.
