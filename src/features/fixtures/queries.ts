import { cache } from 'react'

import {
  countDistinctGroups,
  daysUntilFirstKickoff,
  enrichFixturesWithTeamBadges,
  type CatalogFixtureView,
} from '@/features/fixtures/catalog-view'
import {
  WORLD_CUP_LEAGUE_ID,
  WORLD_CUP_SEASON,
} from '@/features/fixtures/constants'
import { slugifyName } from '@/features/fixtures/normalize'
import { createClient } from '@/lib/supabase/server'
import type { DbFootballFixture, DbFootballTeam, TeamGroup } from '@/lib/types'

const FIXTURE_SELECT =
  'id, provider, provider_fixture_id, league_id, season, round, stage, group_name, kickoff_at, status_short, status_long, elapsed, venue_name, venue_city, home_team_id, home_team_name, home_team_logo, away_team_id, away_team_name, away_team_logo, home_goals, away_goals, home_team_ref, away_team_ref, venue_ref'

const TEAM_SELECT =
  'id, season, name, short_name, slug, country_code, flag_url, badge_url, group_name, is_qualified'

export type WorldCupCalendarSummary = {
  fixtureCount: number
  groupCount: number
  venueCount: number
  daysUntilKickoff: number | null
}

export type WorldCupCalendarPageData = {
  fixtures: CatalogFixtureView[]
  teamGroups: TeamGroup[]
  summary: WorldCupCalendarSummary
}

export const getWorldCupFixtures = cache(async (): Promise<DbFootballFixture[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('football_fixtures')
    .select(FIXTURE_SELECT)
    .eq('league_id', WORLD_CUP_LEAGUE_ID)
    .eq('season', WORLD_CUP_SEASON)
    .order('kickoff_at', { ascending: true, nullsFirst: false })

  if (error) throw error
  return (data ?? []) as DbFootballFixture[]
})

export const getWorldCupVenueCount = cache(async (): Promise<number> => {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from('football_venues')
    .select('id', { count: 'exact', head: true })

  if (error) throw error
  return count ?? 0
})

export const getWorldCupTeams = cache(async (): Promise<DbFootballTeam[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('football_teams')
    .select(TEAM_SELECT)
    .eq('season', WORLD_CUP_SEASON)
    .order('group_name', { ascending: true, nullsFirst: false })
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as DbFootballTeam[]
})

export const getWorldCupTeamsBySlugs = cache(
  async (slugs: string[]): Promise<DbFootballTeam[]> => {
    const unique = [...new Set(slugs.filter(Boolean))]
    if (unique.length === 0) return []

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('football_teams')
      .select(TEAM_SELECT)
      .eq('season', WORLD_CUP_SEASON)
      .in('slug', unique)

    if (error) throw error
    return (data ?? []) as DbFootballTeam[]
  }
)

export const getWorldCupCatalogFixtures = cache(
  async (): Promise<CatalogFixtureView[]> => {
    const [fixtures, teams] = await Promise.all([
      getWorldCupFixtures(),
      getWorldCupTeams(),
    ])
    return enrichFixturesWithTeamBadges(fixtures, teams)
  }
)

export const getWorldCupCalendarPageData = cache(
  async (): Promise<WorldCupCalendarPageData> => {
    const [fixtures, teams, venueCount] = await Promise.all([
      getWorldCupCatalogFixtures(),
      getWorldCupTeams(),
      getWorldCupVenueCount(),
    ])

    return {
      fixtures,
      teamGroups: groupTeamsByGroup(teams),
      summary: {
        fixtureCount: fixtures.length,
        groupCount: countDistinctGroups(teams),
        venueCount,
        daysUntilKickoff: daysUntilFirstKickoff(fixtures),
      },
    }
  }
)

export function groupTeamsByGroup(teams: DbFootballTeam[]): TeamGroup[] {
  const groups = new Map<string, DbFootballTeam[]>()

  for (const team of teams) {
    const key = team.group_name?.trim() || 'Seleções'
    const list = groups.get(key) ?? []
    list.push(team)
    groups.set(key, list)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
    .map(([groupName, groupTeams]) => ({
      groupName,
      teams: groupTeams,
    }))
}

export async function getUpcomingWorldCupFixtures(
  limit = 20
): Promise<DbFootballFixture[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('football_fixtures')
    .select(FIXTURE_SELECT)
    .eq('league_id', WORLD_CUP_LEAGUE_ID)
    .eq('season', WORLD_CUP_SEASON)
    .gte('kickoff_at', now)
    .order('kickoff_at', { ascending: true })
    .limit(limit)

  if (error) throw error
  return (data ?? []) as DbFootballFixture[]
}

export async function getFixtureById(
  fixtureId: string
): Promise<CatalogFixtureView | null> {
  const fixture = await getFixtureByIdRaw(fixtureId)
  if (!fixture) return null

  const slugs = [
    slugifyName(fixture.home_team_name),
    slugifyName(fixture.away_team_name),
  ]
  const teams = await getWorldCupTeamsBySlugs(slugs)
  return enrichFixturesWithTeamBadges([fixture], teams)[0] ?? null
}

export async function getFixtureByIdRaw(
  fixtureId: string
): Promise<DbFootballFixture | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('football_fixtures')
    .select(FIXTURE_SELECT)
    .eq('id', fixtureId)
    .maybeSingle()

  if (error) throw error
  return data as DbFootballFixture | null
}

export type { FixtureDateGroup } from '@/features/fixtures/calendar-groups'
export {
  getFixtureDateSectionId,
  groupFixturesByKickoffDate,
  pickCalendarFocusDateKey,
} from '@/features/fixtures/calendar-groups'
