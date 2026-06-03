import type { ApiFootballRateLimit } from '@/features/fixtures/api-football'
import {
  fetchWorldCupFixturesFromApi,
  mapFixturesToUpsertRows,
} from '@/features/fixtures/api-football'
import {
  API_FOOTBALL_PROVIDER,
  DEFAULT_SYNC_PROVIDER,
  THESPORTSDB_PROVIDER,
  WC26_RAPIDAPI_PROVIDER,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import {
  extractCatalogFromEvents,
  fetchTheSportsDbSeasonEvents,
} from '@/features/fixtures/thesportsdb'
import type {
  FootballFixtureUpsertRow,
  FootballTeamUpsertRow,
  FootballVenueUpsertRow,
  SyncMode,
  SyncProvider,
} from '@/features/fixtures/types'
import { slugifyName, venueSlug } from '@/features/fixtures/normalize'
import {
  extractCatalogFromWc26,
  fetchWc26Catalog,
} from '@/features/fixtures/wc26-rapidapi'
import {
  getApiFootballKey,
  getTheSportsDbApiKey,
  getWc26RapidApiKey,
} from '@/lib/env'
import { createAdminClient } from '@/lib/supabase/admin'

const EXPECTED_WORLD_CUP_FIXTURE_COUNT = 100
const MIN_ACCEPTABLE_FIXTURE_COUNT = 40

function buildFixtureCountWarnings(
  providerLabel: string,
  fixtureCount: number,
  fallbackHint: string
): string[] {
  if (fixtureCount === 0) {
    return [
      `${providerLabel} returned zero fixtures. Run the sync again, then use manual JSON import before a real match if the provider still returns empty data.`,
    ]
  }

  if (fixtureCount < MIN_ACCEPTABLE_FIXTURE_COUNT) {
    return [
      `${providerLabel} returned only ${fixtureCount} fixtures; expected at least ${MIN_ACCEPTABLE_FIXTURE_COUNT}. ${fallbackHint}`,
    ]
  }

  if (fixtureCount < EXPECTED_WORLD_CUP_FIXTURE_COUNT) {
    return [
      `${providerLabel} returned ${fixtureCount} fixtures; expected about 104 for the full World Cup. Validate /calendario and prepare manual JSON import for missing games.`,
    ]
  }

  return []
}

export type SyncWorldCupCatalogResult = {
  ok: true
  provider: SyncProvider
  mode: SyncMode
  season: number
  teamsUpserted: number
  venuesUpserted: number
  fixturesUpserted: number
  requestCount: number
  syncRunId: string
  rateLimit?: ApiFootballRateLimit
  warnings: string[]
}

async function startSyncRun(
  admin: ReturnType<typeof createAdminClient>,
  provider: SyncProvider,
  mode: SyncMode,
  season: number
): Promise<string> {
  const { data, error } = await admin
    .from('football_data_sync_runs')
    .insert({
      provider,
      mode,
      season,
      status: 'running',
    })
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(`Failed to start sync run: ${error?.message ?? 'unknown'}`)
  }

  return data.id as string
}

async function finishSyncRun(
  admin: ReturnType<typeof createAdminClient>,
  syncRunId: string,
  patch: {
    status: 'completed' | 'failed'
    rows_fetched: number
    rows_upserted: number
    warnings: string[]
    error_message?: string
  }
): Promise<void> {
  const { error } = await admin
    .from('football_data_sync_runs')
    .update({
      ...patch,
      completed_at: new Date().toISOString(),
    })
    .eq('id', syncRunId)

  if (error) {
    throw new Error(`Failed to finish sync run: ${error.message}`)
  }
}

async function upsertTeams(
  admin: ReturnType<typeof createAdminClient>,
  teams: FootballTeamUpsertRow[]
): Promise<Map<string, string>> {
  const slugToId = new Map<string, string>()
  if (teams.length === 0) return slugToId

  const { data, error } = await admin
    .from('football_teams')
    .upsert(teams, { onConflict: 'season,slug' })
    .select('id, slug')

  if (error) {
    throw new Error(`Team upsert failed: ${error.message}`)
  }

  for (const row of data ?? []) {
    slugToId.set(row.slug as string, row.id as string)
  }

  return slugToId
}

async function upsertVenues(
  admin: ReturnType<typeof createAdminClient>,
  venues: FootballVenueUpsertRow[]
): Promise<Map<string, string>> {
  const slugToId = new Map<string, string>()
  if (venues.length === 0) return slugToId

  const { data, error } = await admin
    .from('football_venues')
    .upsert(venues, { onConflict: 'slug' })
    .select('id, slug')

  if (error) {
    throw new Error(`Venue upsert failed: ${error.message}`)
  }

  for (const row of data ?? []) {
    slugToId.set(row.slug as string, row.id as string)
  }

  return slugToId
}

function attachFixtureRefs(
  fixtures: FootballFixtureUpsertRow[],
  teamSlugToId: Map<string, string>,
  venueSlugToId: Map<string, string>
): FootballFixtureUpsertRow[] {
  return fixtures.map((fixture) => {
    const homeSlug = slugifyName(fixture.home_team_name)
    const awaySlug = slugifyName(fixture.away_team_name)
    const venueKey =
      fixture.venue_name != null
        ? venueSlug(fixture.venue_name, fixture.venue_city)
        : null

    return {
      ...fixture,
      home_team_ref: teamSlugToId.get(homeSlug) ?? null,
      away_team_ref: teamSlugToId.get(awaySlug) ?? null,
      venue_ref: venueKey ? (venueSlugToId.get(venueKey) ?? null) : null,
    }
  })
}

async function upsertFixtures(
  admin: ReturnType<typeof createAdminClient>,
  fixtures: FootballFixtureUpsertRow[]
): Promise<number> {
  if (fixtures.length === 0) return 0

  const { error } = await admin
    .from('football_fixtures')
    .upsert(fixtures, { onConflict: 'provider,provider_fixture_id' })

  if (error) {
    throw new Error(`Fixture upsert failed: ${error.message}`)
  }

  return fixtures.length
}

async function syncFromTheSportsDb(
  admin: ReturnType<typeof createAdminClient>,
  mode: SyncMode,
  season: number,
  syncedAt: string
): Promise<{
  teams: FootballTeamUpsertRow[]
  venues: FootballVenueUpsertRow[]
  fixtures: FootballFixtureUpsertRow[]
  requestCount: number
  warnings: string[]
}> {
  const apiKey = getTheSportsDbApiKey()
  const { events, requestCount } = await fetchTheSportsDbSeasonEvents(
    apiKey,
    undefined,
    season
  )

  const warnings = buildFixtureCountWarnings(
    'TheSportsDB',
    events.length,
    'Free tier may cap season schedules; consider premium V2 or manual import.'
  )

  const { teams, venues, fixtures } = extractCatalogFromEvents(
    events,
    season,
    syncedAt
  )

  if (mode === 'scores') {
    return { teams: [], venues: [], fixtures, requestCount, warnings }
  }

  return { teams, venues, fixtures, requestCount, warnings }
}

async function syncFromWc26RapidApi(
  mode: SyncMode,
  season: number,
  syncedAt: string
): Promise<{
  teams: FootballTeamUpsertRow[]
  venues: FootballVenueUpsertRow[]
  fixtures: FootballFixtureUpsertRow[]
  requestCount: number
  warnings: string[]
}> {
  const apiKey = getWc26RapidApiKey()
  const { matches, groups, requestCount } = await fetchWc26Catalog(apiKey)
  const warnings = buildFixtureCountWarnings(
    'WC26 RapidAPI',
    matches.length,
    'Check RapidAPI quota and keep manual JSON import ready for missing matches.'
  )

  const { teams, venues, fixtures } = extractCatalogFromWc26(
    matches,
    groups,
    season,
    syncedAt
  )

  if (mode === 'scores') {
    return { teams: [], venues: [], fixtures, requestCount, warnings }
  }

  return { teams, venues, fixtures, requestCount, warnings }
}

async function syncFromApiFootball(
  mode: SyncMode,
  season: number,
  syncedAt: string
): Promise<{
  teams: FootballTeamUpsertRow[]
  venues: FootballVenueUpsertRow[]
  fixtures: FootballFixtureUpsertRow[]
  requestCount: number
  rateLimit: ApiFootballRateLimit
  warnings: string[]
}> {
  const apiKey = getApiFootballKey()
  const { fixtures: apiFixtures, rateLimit, requestCount } =
    await fetchWorldCupFixturesFromApi(apiKey)

  const fixtureRows = mapFixturesToUpsertRows(apiFixtures, syncedAt, season)
  const warnings = buildFixtureCountWarnings(
    'API-Football',
    fixtureRows.length,
    'Free plans may not include season 2026; verify quota and use manual import if needed.'
  )

  if (mode === 'fixtures' || mode === 'catalog') {
    return {
      teams: [],
      venues: [],
      fixtures: fixtureRows,
      requestCount,
      rateLimit,
      warnings,
    }
  }

  return {
    teams: [],
    venues: [],
    fixtures: fixtureRows,
    requestCount,
    rateLimit,
    warnings,
  }
}

export type SyncWorldCupCatalogOptions = {
  provider?: SyncProvider
  mode?: SyncMode
  season?: number
}

export async function syncWorldCupCatalog(
  options: SyncWorldCupCatalogOptions = {}
): Promise<SyncWorldCupCatalogResult> {
  const provider = options.provider ?? DEFAULT_SYNC_PROVIDER
  const mode = options.mode ?? 'catalog'
  const season = options.season ?? WORLD_CUP_SEASON
  const syncedAt = new Date().toISOString()
  const admin = createAdminClient()
  const syncRunId = await startSyncRun(admin, provider, mode, season)

  try {
    let teams: FootballTeamUpsertRow[] = []
    let venues: FootballVenueUpsertRow[] = []
    let fixtures: FootballFixtureUpsertRow[] = []
    let requestCount = 0
    let warnings: string[] = []
    let rateLimit: ApiFootballRateLimit | undefined

    if (provider === THESPORTSDB_PROVIDER) {
      const result = await syncFromTheSportsDb(admin, mode, season, syncedAt)
      teams = result.teams
      venues = result.venues
      fixtures = result.fixtures
      requestCount = result.requestCount
      warnings = result.warnings
    } else if (provider === API_FOOTBALL_PROVIDER) {
      const result = await syncFromApiFootball(mode, season, syncedAt)
      teams = result.teams
      venues = result.venues
      fixtures = result.fixtures
      requestCount = result.requestCount
      warnings = result.warnings
      rateLimit = result.rateLimit
    } else if (provider === WC26_RAPIDAPI_PROVIDER) {
      const result = await syncFromWc26RapidApi(mode, season, syncedAt)
      teams = result.teams
      venues = result.venues
      fixtures = result.fixtures
      requestCount = result.requestCount
      warnings = result.warnings
    } else {
      throw new Error(`Unsupported provider: ${provider}`)
    }

    const teamSlugToId = await upsertTeams(admin, teams)
    const venueSlugToId = await upsertVenues(admin, venues)
    const fixturesWithRefs = attachFixtureRefs(
      fixtures,
      teamSlugToId,
      venueSlugToId
    )
    const fixturesUpserted = await upsertFixtures(admin, fixturesWithRefs)

    const rowsFetched = teams.length + venues.length + fixtures.length
    const rowsUpserted = teams.length + venues.length + fixturesUpserted

    await finishSyncRun(admin, syncRunId, {
      status: 'completed',
      rows_fetched: rowsFetched,
      rows_upserted: rowsUpserted,
      warnings,
    })

    return {
      ok: true,
      provider,
      mode,
      season,
      teamsUpserted: teams.length,
      venuesUpserted: venues.length,
      fixturesUpserted,
      requestCount,
      syncRunId,
      rateLimit,
      warnings,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Catalog sync failed'
    await finishSyncRun(admin, syncRunId, {
      status: 'failed',
      rows_fetched: 0,
      rows_upserted: 0,
      warnings: [
        'Sync failed before completion. Check provider credentials/quota, then retry. If this happens near a real match, use manual JSON import from the runbook.',
      ],
      error_message: message,
    })
    throw error
  }
}

/** Backward-compatible entry: fixtures-only sync via default provider. */
export async function syncWorldCupFixturesFromCatalog(): Promise<{
  upserted: number
  requestCount: number
  rateLimit?: ApiFootballRateLimit
}> {
  const result = await syncWorldCupCatalog({ mode: 'fixtures' })
  return {
    upserted: result.fixturesUpserted,
    requestCount: result.requestCount,
    rateLimit: result.rateLimit,
  }
}
