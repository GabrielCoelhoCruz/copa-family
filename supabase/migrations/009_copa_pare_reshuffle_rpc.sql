-- Atomic Copa Stop letter reshuffle: clear entries + interval points + new letter + reset timer

create or replace function public.reshuffle_copa_pare_letter(
  p_match_id uuid,
  p_new_letter text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_new_letter is null or length(trim(p_new_letter)) = 0 then
    raise exception 'invalid letter';
  end if;

  delete from public.copa_pare_entries
  where match_id = p_match_id;

  delete from public.points
  where match_id = p_match_id
    and source in ('copa_pare_participation', 'copa_pare_unique');

  update public.matches
  set
    copa_pare_letter = p_new_letter,
    halftime_started_at = now()
  where id = p_match_id;
end;
$$;
