-- Copa Stop: shared category + letter per match; expanded entry categories

alter table public.matches
  add column if not exists copa_pare_category text,
  add column if not exists copa_pare_letter text;

alter table public.copa_pare_entries
  drop constraint if exists copa_pare_entries_category_check;

alter table public.copa_pare_entries
  add constraint copa_pare_entries_category_check
  check (
    category in (
      'player',
      'team',
      'coach',
      'stadium',
      'host_city',
      'number_10',
      'legend',
      'football_thing'
    )
  );

drop index if exists public.points_unique_match_user_source_idx;

create unique index points_unique_match_user_source_idx
  on public.points (match_id, user_id, source)
  where match_id is not null
    and source in (
      'prediction_submitted',
      'copa_pare_participation',
      'copa_pare_unique',
      'match_winner_correct',
      'match_player_correct',
      'match_exact_score'
    );
