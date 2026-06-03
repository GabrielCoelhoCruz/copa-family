-- FIFA World Cup 2026 fixture catalog (synced from API-Football)

create table if not exists public.football_fixtures (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'api-football',
  provider_fixture_id integer not null,
  league_id integer not null,
  season integer not null,
  round text,
  stage text,
  group_name text,
  kickoff_at timestamptz,
  status_short text,
  status_long text,
  elapsed integer,
  venue_name text,
  venue_city text,
  home_team_id integer,
  home_team_name text not null,
  home_team_logo text,
  away_team_id integer,
  away_team_name text not null,
  away_team_logo text,
  home_goals int,
  away_goals int,
  raw jsonb,
  last_synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (provider, provider_fixture_id)
);

create index if not exists idx_football_fixtures_league_season_kickoff
  on public.football_fixtures (league_id, season, kickoff_at);

create index if not exists idx_football_fixtures_status_short
  on public.football_fixtures (status_short);

alter table public.matches
  add column if not exists fixture_id uuid references public.football_fixtures (id) on delete set null;

create index if not exists idx_matches_fixture_id on public.matches (fixture_id);

alter table public.football_fixtures enable row level security;

create policy "football_fixtures_select_all"
  on public.football_fixtures
  for select
  using (true);

-- No insert/update/delete policies for anon/authenticated; sync uses service role.
