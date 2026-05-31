-- Copa Pare participation (halftime mini-game)
create table if not exists public.copa_pare_entries (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches(id) on delete cascade,
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.users(id),
  category text not null check (category in ('player', 'team', 'coach', 'stadium')),
  answer text not null,
  created_at timestamptz not null default now(),
  unique(match_id, user_id)
);

create index if not exists idx_copa_pare_match_id on public.copa_pare_entries(match_id);

alter table public.copa_pare_entries enable row level security;
create policy "allow_all_copa_pare_entries" on public.copa_pare_entries
  for all using (true) with check (true);
