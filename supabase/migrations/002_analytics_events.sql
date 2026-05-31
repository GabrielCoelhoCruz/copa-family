-- Analytics events (MVP validation metrics)
create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  room_id uuid references public.rooms(id) on delete set null,
  match_id uuid references public.matches(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_analytics_events_name on public.analytics_events(event_name);
create index if not exists idx_analytics_events_room_id on public.analytics_events(room_id);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at desc);

alter table public.analytics_events enable row level security;
create policy "allow_all_analytics_events" on public.analytics_events
  for all using (true) with check (true);
