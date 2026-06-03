import {
  THESPORTSDB_BASE_URL,
  THESPORTSDB_PROVIDER,
  THESPORTSDB_WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import {
  buildKickoffAt,
  parseGroupLetter,
  parseStageFromRound,
  slugifyName,
  venueSlug,
} from '@/features/fixtures/normalize'
import type {
  FootballFixtureUpsertRow,
  FootballTeamUpsertRow,
  FootballVenueUpsertRow,
} from '@/features/fixtures/types'

export type TheSportsDbEvent = {
  idEvent: string
  idAPIfootball?: string | null
  strEvent?: string | null
  strSport?: string | null
  idLeague?: string | null
  strLeague?: string | null
  strSeason?: string | null
  strHomeTeam: string
  strAwayTeam: string
  intHomeScore?: string | null
  intAwayScore?: string | null
  strStatus?: string | null
  dateEvent: string
  strTime?: string | null
  strTimestamp?: string | null
  strGroup?: string | null
  idHomeTeam?: string | null
  strHomeTeamBadge?: string | null
  idAwayTeam?: string | null
  strAwayTeamBadge?: string | null
  idVenue?: string | null
  strVenue?: string | null
  strCity?: string | null
  strCountry?: string | null
  strRound?: string | null
  strThumb?: string | null
}

type EventsSeasonResponse = {
  events: TheSportsDbEvent[] | null
}

export function parseTheSportsDbScore(
  value: string | null | undefined
): number | null {
  if (value == null || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

export function mapTheSportsDbTeamRow(
  event: TheSportsDbEvent,
  side: 'home' | 'away',
  season: number,
  syncedAt: string
): FootballTeamUpsertRow {
  const isHome = side === 'home'
  const name = isHome ? event.strHomeTeam : event.strAwayTeam
  const providerTeamId = isHome ? event.idHomeTeam : event.idAwayTeam
  const badge = isHome ? event.strHomeTeamBadge : event.strAwayTeamBadge

  return {
    season,
    name,
    short_name: name,
    slug: slugifyName(name),
    country_code: null,
    flag_url: badge ?? null,
    badge_url: badge ?? null,
    group_name: parseGroupLetter(event.strGroup ?? null),
    is_qualified: true,
    provider_refs: {
      thesportsdb: providerTeamId ?? slugifyName(name),
    },
    raw_sources: {
      thesportsdb: {
        idTeam: providerTeamId,
        strTeam: name,
        strBadge: badge,
        fromEventId: event.idEvent,
      },
    },
    updated_at: syncedAt,
  }
}

export function mapTheSportsDbVenueRow(
  event: TheSportsDbEvent
): FootballVenueUpsertRow | null {
  const name = event.strVenue?.trim()
  if (!name) return null

  const city = event.strCity?.trim() || null
  const country = event.strCountry?.trim() || null

  return {
    name,
    city,
    country,
    timezone: null,
    slug: venueSlug(name, city),
    provider_refs: {
      thesportsdb: event.idVenue ?? venueSlug(name, city),
    },
    raw_sources: {
      thesportsdb: {
        idVenue: event.idVenue,
        strVenue: name,
        strCity: city,
        strCountry: country,
      },
    },
  }
}

export function mapTheSportsDbFixtureToRow(
  event: TheSportsDbEvent,
  syncedAt: string,
  season = WORLD_CUP_SEASON
): FootballFixtureUpsertRow {
  const round = event.strRound ?? null
  const kickoffAt = buildKickoffAt(
    event.dateEvent,
    event.strTime ?? null,
    event.strTimestamp ?? null
  )

  return {
    provider: THESPORTSDB_PROVIDER,
    provider_fixture_id: Number(event.idEvent),
    league_id: WORLD_CUP_LEAGUE_ID,
    season,
    round,
    stage: parseStageFromRound(round),
    group_name: parseGroupLetter(event.strGroup ?? null),
    kickoff_at: kickoffAt,
    status_short: event.strStatus ?? null,
    status_long: event.strStatus ?? null,
    elapsed: null,
    venue_name: event.strVenue ?? null,
    venue_city: event.strCity ?? null,
    home_team_id: event.idHomeTeam ? Number(event.idHomeTeam) : null,
    home_team_name: event.strHomeTeam,
    home_team_logo: event.strHomeTeamBadge ?? null,
    away_team_id: event.idAwayTeam ? Number(event.idAwayTeam) : null,
    away_team_name: event.strAwayTeam,
    away_team_logo: event.strAwayTeamBadge ?? null,
    home_goals: parseTheSportsDbScore(event.intHomeScore),
    away_goals: parseTheSportsDbScore(event.intAwayScore),
    raw: event,
    last_synced_at: syncedAt,
    data_confidence: 'provider',
    source_priority: 2,
    last_verified_at: syncedAt,
  }
}

export async function fetchTheSportsDbSeasonEvents(
  apiKey: string,
  leagueId = THESPORTSDB_WORLD_CUP_LEAGUE_ID,
  season = WORLD_CUP_SEASON
): Promise<{ events: TheSportsDbEvent[]; requestCount: number }> {
  const url = new URL(`${THESPORTSDB_BASE_URL}/${apiKey}/eventsseason.php`)
  url.searchParams.set('id', String(leagueId))
  url.searchParams.set('s', String(season))

  const response = await fetch(url.toString(), { next: { revalidate: 0 } })

  if (!response.ok) {
    throw new Error(
      `TheSportsDB eventsseason failed: ${response.status} ${response.statusText}`
    )
  }

  const data = (await response.json()) as EventsSeasonResponse
  return {
    events: data.events ?? [],
    requestCount: 1,
  }
}

export function extractCatalogFromEvents(
  events: TheSportsDbEvent[],
  season: number,
  syncedAt: string
): {
  teams: FootballTeamUpsertRow[]
  venues: FootballVenueUpsertRow[]
  fixtures: FootballFixtureUpsertRow[]
} {
  const teamBySlug = new Map<string, FootballTeamUpsertRow>()
  const venueBySlug = new Map<string, FootballVenueUpsertRow>()
  const fixtures: FootballFixtureUpsertRow[] = []

  for (const event of events) {
    const homeTeam = mapTheSportsDbTeamRow(event, 'home', season, syncedAt)
    const awayTeam = mapTheSportsDbTeamRow(event, 'away', season, syncedAt)
    teamBySlug.set(homeTeam.slug, homeTeam)
    teamBySlug.set(awayTeam.slug, awayTeam)

    const venue = mapTheSportsDbVenueRow(event)
    if (venue) venueBySlug.set(venue.slug, venue)

    fixtures.push(mapTheSportsDbFixtureToRow(event, syncedAt, season))
  }

  return {
    teams: [...teamBySlug.values()],
    venues: [...venueBySlug.values()],
    fixtures,
  }
}
