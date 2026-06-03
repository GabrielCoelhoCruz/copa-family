/** API-Football World Cup league (v3). */
export const WORLD_CUP_LEAGUE_ID = 1

/** TheSportsDB FIFA World Cup league id. */
export const THESPORTSDB_WORLD_CUP_LEAGUE_ID = 4429

/** App season label (stored in DB). */
export const WORLD_CUP_SEASON = Number(process.env.WORLD_CUP_SEASON ?? 2026)

/** API-Football fetch season (free plan: 2022–2024 only). */
export const API_FOOTBALL_FETCH_SEASON = Number(
  process.env.API_FOOTBALL_FETCH_SEASON ?? 2022
)

export const API_FOOTBALL_PROVIDER = 'api-football' as const
export const THESPORTSDB_PROVIDER = 'thesportsdb' as const
export const WC26_RAPIDAPI_PROVIDER = 'wc26-rapidapi' as const

export const API_FOOTBALL_BASE_URL = 'https://v3.football.api-sports.io'
export const THESPORTSDB_BASE_URL = 'https://www.thesportsdb.com/api/v1/json'
export const WC26_RAPIDAPI_HOST = 'wc26-live-football-api.p.rapidapi.com'

export const DEFAULT_SYNC_PROVIDER =
  (process.env.FIXTURE_SYNC_PROVIDER as
    | 'thesportsdb'
    | 'api-football'
    | 'wc26-rapidapi'
    | undefined) ?? 'wc26-rapidapi'
