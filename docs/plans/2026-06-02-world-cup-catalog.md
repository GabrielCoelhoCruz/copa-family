# World Cup Data Catalog — Implementation Notes

**Goal:** Reusable teams, venues, and fixtures in Supabase; TheSportsDB seeds Copa 2026; app reads catalog only.

## Data flow

1. Admin calls `POST /api/admin/fixtures/sync` with `{ "provider": "thesportsdb", "mode": "catalog" }`.
2. Server upserts `football_teams`, `football_venues`, `football_fixtures` (with refs).
3. Audit row in `football_data_sync_runs`.
4. UI: `/calendario`, `/criar-sala`, `/sala/[code]` read Supabase (0 API calls).

## App experience (catalog showcase)

| Surface | Route | Behavior |
| --- | --- | --- |
| Public calendar | `/calendario` | Summary strip (jogos, grupos, sedes, countdown); rich fixture cards with flags + **Criar sala** per game |
| Create room | `/criar-sala?fixture=<uuid>` | Pre-selects fixture from calendar (`routes.criarSalaComFixture`) |
| Room hero | `/sala/[code]` | `TeamVersusStrip` + kickoff / group / venue; single contextual CTA from `RoomNextAction` |
| Admin catalog | `/admin/catalogo` | Gated by `ENABLE_ADMIN_METRICS=true`; counts, last sync, env OK/missing (no secret values); server actions sync + flagcdn enrich |

Flow: **Calendário → Criar sala (pré-selecionado) → Sala**.

## Env

See `.env.example`: `THESPORTSDB_API_KEY`, `FIXTURE_SYNC_PROVIDER`, `SUPABASE_SERVICE_ROLE_KEY`, `FIXTURE_SYNC_TOKEN`.

## Migration

`supabase/migrations/005_world_cup_catalog.sql`

## Providers

| Provider | Env | Schedule coverage |
| --- | --- | --- |
| `wc26-rapidapi` (default) | `RAPIDAPI_WC26_KEY` | ~104 matches (Copa 2026) |
| `thesportsdb` | `THESPORTSDB_API_KEY` | ~15 on free tier |
| `api-football` | `API_FOOTBALL_KEY` | 2026 on paid plan; free uses `API_FOOTBALL_FETCH_SEASON=2022` |

See [mcp-wc26-rapidapi.md](../mcp-wc26-rapidapi.md) for Cursor MCP setup.

## Limits

- TheSportsDB free `eventsseason` may return ~15 events; warnings are stored on sync run.
- API-Football free plan: use `API_FOOTBALL_FETCH_SEASON=2022` only when provider is `api-football`.

## Team badges and players

| Data | Source | Command / notes |
| --- | --- | --- |
| Badges (flags) | [flagcdn.com](https://flagcdn.com) via `team-country-flags.ts` | `npm run enrich:flags` after catalog sync |
| Badges (crests) | TheSportsDB `searchteams.php` | `node scripts/enrich-team-badges-thesportsdb.mjs` — rate-limit friendly (delay between calls) |
| WC26 API | `/teams`, `/teams/{name}` | Stats only — **no** badge or player URLs |
| Players | TheSportsDB `lookup_all_players.php?id={idTeam}` | Optional future `football_players` table; **out of MVP** (palpite “jogador da partida” is free text) |

## Manual import (future)

Store official JSON under `data/world-cup/` and add an import script that maps to the same upsert types in `src/features/fixtures/types.ts`.
