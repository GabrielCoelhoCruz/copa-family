-- Production security hardening for guest-cookie server actions.

alter table public.room_members
  drop constraint if exists room_members_role_check;

alter table public.room_members
  add constraint room_members_role_check
  check (role in ('owner', 'co_host', 'member'));

alter table public.rooms
  add column if not exists last_host_action_at timestamptz not null default now();

create index if not exists idx_points_room_match_user
  on public.points (room_id, match_id, user_id);

create unique index if not exists points_unique_match_user_source_idx
  on public.points (match_id, user_id, source)
  where match_id is not null
    and source in (
      'prediction_submitted',
      'copa_pare_participation',
      'match_winner_correct',
      'match_player_correct',
      'match_exact_score'
    );

drop policy if exists "allow_all_users" on public.users;
drop policy if exists "allow_all_rooms" on public.rooms;
drop policy if exists "allow_all_room_members" on public.room_members;
drop policy if exists "allow_all_matches" on public.matches;
drop policy if exists "allow_all_predictions" on public.predictions;
drop policy if exists "allow_all_points" on public.points;
drop policy if exists "allow_all_analytics_events" on public.analytics_events;
drop policy if exists "allow_all_copa_pare_entries" on public.copa_pare_entries;
drop policy if exists "users_select_public" on public.users;
drop policy if exists "rooms_select_public" on public.rooms;
drop policy if exists "room_members_select_public" on public.room_members;
drop policy if exists "matches_select_public" on public.matches;
drop policy if exists "predictions_select_public" on public.predictions;
drop policy if exists "points_select_public" on public.points;
drop policy if exists "copa_pare_entries_select_public" on public.copa_pare_entries;
drop policy if exists "analytics_events_insert_public" on public.analytics_events;

create policy "users_select_public"
  on public.users for select
  using (true);

create policy "rooms_select_public"
  on public.rooms for select
  using (true);

create policy "room_members_select_public"
  on public.room_members for select
  using (true);

create policy "matches_select_public"
  on public.matches for select
  using (true);

create policy "predictions_select_public"
  on public.predictions for select
  using (true);

create policy "points_select_public"
  on public.points for select
  using (true);

create policy "copa_pare_entries_select_public"
  on public.copa_pare_entries for select
  using (true);

create policy "analytics_events_insert_public"
  on public.analytics_events for insert
  with check (true);

-- Writes to game tables are intentionally service-role only. The Next.js server
-- actions validate guest cookies, room membership, host role, and match binding
-- before using the service role client.
