# World Cup 2026 Fixtures — Implementation Notes

**Goal:** Sync FIFA World Cup 2026 schedule into Supabase and bind rooms to real fixtures, with optional API-Sports widgets.

**See also:** [2026-06-02-world-cup-catalog.md](./2026-06-02-world-cup-catalog.md) for teams, venues, and TheSportsDB catalog sync.

## Quota policy (free plan ~100 req/day)

| Action | API calls |
| --- | --- |
| Normal app usage (calendar, rooms, palpites) | **0** (reads Supabase only) |
| `POST /api/admin/fixtures/sync` | **1** per sync |
| API-Sports widgets (if enabled) | **Per visitor** — keep disabled in production unless domain-restricted |

## Environment

See [.env.example](../../.env.example). Required for sync:

- `API_FOOTBALL_KEY` — server only
- `SUPABASE_SERVICE_ROLE_KEY` — server only
- `FIXTURE_SYNC_TOKEN` — protects sync route

Optional widgets:

- `NEXT_PUBLIC_ENABLE_API_SPORTS_WIDGETS=true`
- `NEXT_PUBLIC_API_SPORTS_WIDGET_KEY` — visible in HTML; restrict domains in API-Sports dashboard

**Security:** Rotate any API key shared in chat. Never commit `.env.local`.

## Database

Apply migration `supabase/migrations/004_world_cup_fixtures.sql` in Supabase SQL Editor or `supabase db push`.

## Sync fixtures

```bash
curl -X POST https://your-app.vercel.app/api/admin/fixtures/sync \
  -H "Authorization: Bearer YOUR_FIXTURE_SYNC_TOKEN"
```

Response includes `upserted`, `requestCount`, and rate-limit headers.

## User flows

1. Admin syncs fixtures once (or on a schedule).
2. Users open `/calendario` or create room at `/criar-sala` and pick a game.
3. Room match title and palpites use canonical team names.
4. Host still controls match status and results manually.

## Widgets

Collapsed panels on `/calendario` and room board when flags are on. `data-refresh="false"` to avoid polling.
