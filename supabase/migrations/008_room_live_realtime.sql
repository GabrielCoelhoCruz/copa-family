-- Guest live sync: broadcast match status changes to room clients via Supabase Realtime.
-- After deploy: Dashboard → Database → Publications → supabase_realtime → confirm `matches` is listed.

alter publication supabase_realtime add table public.matches;
