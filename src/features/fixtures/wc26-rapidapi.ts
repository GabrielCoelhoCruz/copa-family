import {
  WC26_RAPIDAPI_HOST,
  WC26_RAPIDAPI_PROVIDER,
  WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import {
  isKnockoutPlaceholderName,
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

export type Wc26Match = {
  id: number
  home: string
  away: string
  date: string
  time: string
  group: string
  round: string
  venue: string
  status: string
  score: Wc26Score | string | null
  played: boolean
  minute?: number
  live_data?: unknown
}

export type Wc26Score = {
  home?: number | null
  away?: number | null
}

export type Wc26Group = {
  name: string
  teams: string[]
  match_count?: number
}

type Wc26ListResponse<T> = {
  count?: number
  data: T
  status?: string
}

export function parseWc26Kickoff(date: string, time: string): string | null {
  if (!date) return null
  const timeMatch = time.match(/(\d{1,2}):(\d{2})/)
  if (!timeMatch) return `${date}T12:00:00Z`

  const hour = timeMatch[1].padStart(2, '0')
  const minute = timeMatch[2]
  const offsetMatch = time.match(/UTC([+-]?\d+)/i)

  if (offsetMatch) {
    const raw = Number(offsetMatch[1])
    const sign = raw < 0 ? '-' : '+'
    const absHours = Math.abs(raw).toString().padStart(2, '0')
    return `${date}T${hour}:${minute}:00${sign}${absHours}:00`
  }

  return `${date}T${hour}:${minute}:00Z`
}

export function mapWc26GroupName(group: string | null): string | null {
  if (!group) return null
  const letterMatch = group.match(/Group\s+([A-L])\b/i)
  if (letterMatch) return `Grupo ${letterMatch[1].toUpperCase()}`
  return parseGroupLetter(group)
}

export function mapWc26Status(status: string): {
  short: string
  long: string
} {
  const normalized = status.trim().toLowerCase()
  if (normalized === 'scheduled') return { short: 'NS', long: 'Not Started' }
  if (normalized === 'live' || normalized === 'in_progress') {
    return { short: 'LIVE', long: 'Live' }
  }
  if (normalized === 'finished' || normalized === 'played') {
    return { short: 'FT', long: 'Match Finished' }
  }
  return { short: status.slice(0, 8).toUpperCase(), long: status }
}

export function parseWc26Score(
  score: Wc26Match['score']
): { home: number | null; away: number | null } {
  if (score == null) return { home: null, away: null }
  if (typeof score === 'string') {
    const parts = score.split(/[-:]/).map((part) => Number(part.trim()))
    if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
      return { home: parts[0], away: parts[1] }
    }
    return { home: null, away: null }
  }
  return {
    home: score.home ?? null,
    away: score.away ?? null,
  }
}

function isRealTeamName(name: string): boolean {
  const trimmed = name.trim()
  if (!trimmed) return false
  if (isKnockoutPlaceholderName(trimmed)) return false
  return true
}

export function mapWc26TeamRow(
  name: string,
  groupName: string | null,
  season: number,
  syncedAt: string
): FootballTeamUpsertRow {
  return {
    season,
    name,
    short_name: name,
    slug: slugifyName(name),
    country_code: null,
    flag_url: null,
    badge_url: null,
    group_name: groupName,
    is_qualified: true,
    provider_refs: { wc26: slugifyName(name) },
    raw_sources: { wc26: { name, group: groupName } },
    updated_at: syncedAt,
  }
}

export function mapWc26VenueRow(venueName: string): FootballVenueUpsertRow | null {
  const name = venueName.trim()
  if (!name) return null
  return {
    name,
    city: name,
    country: null,
    timezone: null,
    slug: venueSlug(name, null),
    provider_refs: { wc26: venueSlug(name, null) },
    raw_sources: { wc26: { venue: name } },
  }
}

export function mapWc26MatchToFixtureRow(
  match: Wc26Match,
  syncedAt: string,
  season = WORLD_CUP_SEASON
): FootballFixtureUpsertRow {
  const round = match.round ?? null
  const status = mapWc26Status(match.status)
  const goals = parseWc26Score(match.score)

  return {
    provider: WC26_RAPIDAPI_PROVIDER,
    provider_fixture_id: match.id,
    league_id: WORLD_CUP_LEAGUE_ID,
    season,
    round,
    stage: parseStageFromRound(round),
    group_name: mapWc26GroupName(match.group),
    kickoff_at: parseWc26Kickoff(match.date, match.time),
    status_short: status.short,
    status_long: status.long,
    elapsed: match.minute ?? null,
    venue_name: match.venue,
    venue_city: match.venue,
    home_team_id: null,
    home_team_name: match.home,
    home_team_logo: null,
    away_team_id: null,
    away_team_name: match.away,
    away_team_logo: null,
    home_goals: goals.home,
    away_goals: goals.away,
    raw: match,
    last_synced_at: syncedAt,
    data_confidence: 'provider',
    source_priority: 3,
    last_verified_at: syncedAt,
  }
}

async function fetchWc26Json<T>(apiKey: string, path: string): Promise<T> {
  const response = await fetch(`https://${WC26_RAPIDAPI_HOST}${path}`, {
    headers: {
      'x-rapidapi-host': WC26_RAPIDAPI_HOST,
      'x-rapidapi-key': apiKey,
    },
    next: { revalidate: 0 },
  })

  if (!response.ok) {
    throw new Error(`WC26 API ${path} failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export async function fetchWc26Catalog(
  apiKey: string
): Promise<{
  matches: Wc26Match[]
  groups: Wc26Group[]
  requestCount: number
}> {
  const [matchesRes, groupsRes] = await Promise.all([
    fetchWc26Json<Wc26ListResponse<Wc26Match[]>>(apiKey, '/matches'),
    fetchWc26Json<Wc26ListResponse<Wc26Group[]>>(apiKey, '/groups'),
  ])

  return {
    matches: matchesRes.data ?? [],
    groups: groupsRes.data ?? [],
    requestCount: 2,
  }
}

export function extractCatalogFromWc26(
  matches: Wc26Match[],
  groups: Wc26Group[],
  season: number,
  syncedAt: string
): {
  teams: FootballTeamUpsertRow[]
  venues: FootballVenueUpsertRow[]
  fixtures: FootballFixtureUpsertRow[]
} {
  const teamBySlug = new Map<string, FootballTeamUpsertRow>()
  const venueBySlug = new Map<string, FootballVenueUpsertRow>()
  const fixtures = matches.map((match) =>
    mapWc26MatchToFixtureRow(match, syncedAt, season)
  )

  for (const group of groups) {
    const groupName = mapWc26GroupName(group.name)
    for (const teamName of group.teams) {
      if (!isRealTeamName(teamName)) continue
      const row = mapWc26TeamRow(teamName, groupName, season, syncedAt)
      teamBySlug.set(row.slug, row)
    }
  }

  for (const match of matches) {
    for (const teamName of [match.home, match.away]) {
      if (!isRealTeamName(teamName)) continue
      const groupName = mapWc26GroupName(match.group)
      const row = mapWc26TeamRow(teamName, groupName, season, syncedAt)
      if (!teamBySlug.has(row.slug)) teamBySlug.set(row.slug, row)
    }

    const venue = mapWc26VenueRow(match.venue)
    if (venue) venueBySlug.set(venue.slug, venue)
  }

  return {
    teams: [...teamBySlug.values()],
    venues: [...venueBySlug.values()],
    fixtures,
  }
}
