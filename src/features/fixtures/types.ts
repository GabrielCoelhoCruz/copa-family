export type FootballFixtureUpsertRow = {
  provider: string
  provider_fixture_id: number
  league_id: number
  season: number
  round: string | null
  stage: string | null
  group_name: string | null
  kickoff_at: string | null
  status_short: string | null
  status_long: string | null
  elapsed: number | null
  venue_name: string | null
  venue_city: string | null
  home_team_id: number | null
  home_team_name: string
  home_team_logo: string | null
  away_team_id: number | null
  away_team_name: string
  away_team_logo: string | null
  home_goals: number | null
  away_goals: number | null
  raw: unknown
  last_synced_at: string
  home_team_ref?: string | null
  away_team_ref?: string | null
  venue_ref?: string | null
  source_priority?: number
  data_confidence?: 'provider' | 'manual' | 'verified'
  last_verified_at?: string | null
}

export type FootballTeamUpsertRow = {
  season: number
  name: string
  short_name: string | null
  slug: string
  country_code: string | null
  flag_url: string | null
  badge_url: string | null
  group_name: string | null
  is_qualified: boolean
  provider_refs: Record<string, string | number>
  raw_sources: Record<string, unknown>
  updated_at: string
}

export type FootballVenueUpsertRow = {
  name: string
  city: string | null
  country: string | null
  timezone: string | null
  slug: string
  provider_refs: Record<string, string | number>
  raw_sources: Record<string, unknown>
}

export type SyncMode = 'catalog' | 'fixtures' | 'scores'
export type SyncProvider = 'thesportsdb' | 'api-football' | 'wc26-rapidapi'
