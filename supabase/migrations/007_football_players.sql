-- Featured World Cup players for user avatars (photos in Storage)

create table if not exists public.football_players (
  id uuid primary key default gen_random_uuid(),
  season integer not null,
  name text not null,
  slug text not null,
  team_name text not null,
  team_slug text,
  thesportsdb_player_id text,
  photo_storage_path text,
  photo_url text,
  is_selectable boolean not null default true,
  sort_order integer not null default 0,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season, slug)
);

create index if not exists idx_football_players_season_selectable
  on public.football_players (season, is_selectable, sort_order);

alter table public.users
  add column if not exists avatar_player_id uuid references public.football_players (id) on delete set null;

create index if not exists idx_users_avatar_player_id
  on public.users (avatar_player_id);

alter table public.football_players enable row level security;

create policy "football_players_select_all"
  on public.football_players
  for select
  using (true);

-- Storage bucket for player portrait images (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'player-portraits',
  'player-portraits',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "player_portraits_public_read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'player-portraits');

-- Writes via service role only (no insert policy for anon/authenticated)
