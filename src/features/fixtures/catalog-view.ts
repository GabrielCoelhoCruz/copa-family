import { isKnockoutPlaceholderName, slugifyName } from '@/features/fixtures/normalize'
import { nationalTeamFlagUrl } from '@/features/fixtures/team-country-flags'
import type { DbFootballFixture, DbFootballTeam } from '@/lib/types'

export type CatalogFixtureView = DbFootballFixture & {
  home_team_badge_url: string | null
  away_team_badge_url: string | null
}

function teamBadgeByName(
  teamsBySlug: Map<string, DbFootballTeam>,
  teamName: string
): string | null {
  const team = teamsBySlug.get(slugifyName(teamName))
  if (team?.badge_url) return team.badge_url
  if (team?.flag_url) return team.flag_url
  if (isKnockoutPlaceholderName(teamName)) return null
  return nationalTeamFlagUrl(teamName)
}

export function buildTeamsBySlug(teams: DbFootballTeam[]): Map<string, DbFootballTeam> {
  const map = new Map<string, DbFootballTeam>()
  for (const team of teams) {
    map.set(team.slug, team)
  }
  return map
}

export function enrichFixturesWithTeamBadges(
  fixtures: DbFootballFixture[],
  teams: DbFootballTeam[]
): CatalogFixtureView[] {
  const teamsBySlug = buildTeamsBySlug(teams)
  return fixtures.map((fixture) => ({
    ...fixture,
    home_team_badge_url: teamBadgeByName(teamsBySlug, fixture.home_team_name),
    away_team_badge_url: teamBadgeByName(teamsBySlug, fixture.away_team_name),
  }))
}

export function countRealTeams(teams: DbFootballTeam[]): number {
  return teams.filter((t) => !isKnockoutPlaceholderName(t.name)).length
}

export function countTeamsWithBadge(teams: DbFootballTeam[]): number {
  return teams.filter((t) => Boolean(t.badge_url || t.flag_url)).length
}

export function countDistinctGroups(teams: DbFootballTeam[]): number {
  const groups = new Set(
    teams
      .map((t) => t.group_name?.trim())
      .filter((g): g is string => Boolean(g && g.startsWith('Grupo')))
  )
  return groups.size
}

export function countDistinctVenueNames(
  rows: ReadonlyArray<{ venue_name: string | null }>
): number {
  const venues = new Set(
    rows
      .map((f) => f.venue_name?.trim())
      .filter((v): v is string => Boolean(v))
  )
  return venues.size
}

export function daysUntilFirstKickoff(fixtures: DbFootballFixture[]): number | null {
  const now = Date.now()
  const upcoming = fixtures
    .map((f) => (f.kickoff_at ? new Date(f.kickoff_at).getTime() : null))
    .filter((t): t is number => t != null && t >= now)
    .sort((a, b) => a - b)[0]

  if (upcoming == null) return null
  return Math.max(0, Math.ceil((upcoming - now) / (1000 * 60 * 60 * 24)))
}
