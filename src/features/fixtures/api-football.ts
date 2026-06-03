import {
  API_FOOTBALL_BASE_URL,
  API_FOOTBALL_FETCH_SEASON,
  API_FOOTBALL_PROVIDER,
  WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import {
  buildMatchTitle,
  parseGroupFromRound,
  parseStageFromRound,
} from '@/features/fixtures/normalize'
import type { FootballFixtureUpsertRow } from '@/features/fixtures/types'

export type ApiFootballFixtureItem = {
  fixture: {
    id: number
    date: string | null
    timestamp: number | null
    status: {
      short: string | null
      long: string | null
      elapsed: number | null
    }
    venue: {
      name: string | null
      city: string | null
    } | null
  }
  league: {
    id: number
    season: number
    round: string | null
  }
  teams: {
    home: {
      id: number
      name: string
      logo: string | null
      winner: boolean | null
    }
    away: {
      id: number
      name: string
      logo: string | null
      winner: boolean | null
    }
  }
  goals: {
    home: number | null
    away: number | null
  }
  score?: unknown
}

export type ApiFootballFixturesResponse = {
  response: ApiFootballFixtureItem[]
  errors?: Record<string, string>
  paging?: { current: number; total: number }
}

export type ApiFootballRateLimit = {
  requestsLimit: string | null
  requestsRemaining: string | null
  perMinuteLimit: string | null
  perMinuteRemaining: string | null
}

export function mapApiFootballFixtureToRow(
  item: ApiFootballFixtureItem,
  syncedAt: string,
  seasonOverride = WORLD_CUP_SEASON
): FootballFixtureUpsertRow {
  const round = item.league.round ?? null
  return {
    provider: API_FOOTBALL_PROVIDER,
    provider_fixture_id: item.fixture.id,
    league_id: item.league.id,
    season: seasonOverride,
    round,
    stage: parseStageFromRound(round),
    group_name: parseGroupFromRound(round),
    kickoff_at: item.fixture.date,
    status_short: item.fixture.status.short,
    status_long: item.fixture.status.long,
    elapsed: item.fixture.status.elapsed,
    venue_name: item.fixture.venue?.name ?? null,
    venue_city: item.fixture.venue?.city ?? null,
    home_team_id: item.teams.home.id,
    home_team_name: item.teams.home.name,
    home_team_logo: item.teams.home.logo,
    away_team_id: item.teams.away.id,
    away_team_name: item.teams.away.name,
    away_team_logo: item.teams.away.logo,
    home_goals: item.goals.home,
    away_goals: item.goals.away,
    raw: item,
    last_synced_at: syncedAt,
    data_confidence: 'provider',
    source_priority: 1,
  }
}

export function buildMatchTitleFromFixture(
  row: Pick<FootballFixtureUpsertRow, 'home_team_name' | 'away_team_name' | 'round' | 'stage'>
): string {
  return buildMatchTitle(
    row.home_team_name,
    row.away_team_name,
    row.round,
    row.stage
  )
}

function readRateLimitHeaders(headers: Headers): ApiFootballRateLimit {
  return {
    requestsLimit: headers.get('x-ratelimit-requests-limit'),
    requestsRemaining: headers.get('x-ratelimit-requests-remaining'),
    perMinuteLimit: headers.get('X-RateLimit-Limit'),
    perMinuteRemaining: headers.get('X-RateLimit-Remaining'),
  }
}

export async function fetchWorldCupFixturesFromApi(
  apiKey: string,
  fetchSeason = API_FOOTBALL_FETCH_SEASON
): Promise<{
  fixtures: ApiFootballFixtureItem[]
  rateLimit: ApiFootballRateLimit
  requestCount: number
}> {
  const url = new URL(`${API_FOOTBALL_BASE_URL}/fixtures`)
  url.searchParams.set('league', String(WORLD_CUP_LEAGUE_ID))
  url.searchParams.set('season', String(fetchSeason))

  const response = await fetch(url.toString(), {
    headers: {
      'x-apisports-key': apiKey,
    },
    next: { revalidate: 0 },
  })

  const rateLimit = readRateLimitHeaders(response.headers)

  if (!response.ok) {
    throw new Error(
      `API-Football fixtures failed: ${response.status} ${response.statusText}`
    )
  }

  const data = (await response.json()) as ApiFootballFixturesResponse

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(
      `API-Football errors: ${JSON.stringify(data.errors)}`
    )
  }

  return {
    fixtures: data.response ?? [],
    rateLimit,
    requestCount: 1,
  }
}

export function mapFixturesToUpsertRows(
  fixtures: ApiFootballFixtureItem[],
  syncedAt: string,
  seasonOverride = WORLD_CUP_SEASON
): FootballFixtureUpsertRow[] {
  return fixtures.map((item) =>
    mapApiFootballFixtureToRow(item, syncedAt, seasonOverride)
  )
}
