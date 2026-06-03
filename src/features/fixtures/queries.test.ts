import { describe, expect, it } from 'vitest'

import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  groupFixturesByKickoffDate,
  groupTeamsByGroup,
} from '@/features/fixtures/queries'
import type { DbFootballFixture, DbFootballTeam } from '@/lib/types'

function makeFixture(
  partial: Partial<DbFootballFixture> & Pick<DbFootballFixture, 'id'>
): DbFootballFixture {
  return {
    id: partial.id,
    provider: 'api-football',
    provider_fixture_id: partial.provider_fixture_id ?? 1,
    league_id: 1,
    season: 2026,
    round: null,
    stage: null,
    group_name: null,
    kickoff_at: partial.kickoff_at ?? null,
    status_short: null,
    status_long: null,
    elapsed: null,
    venue_name: null,
    venue_city: null,
    home_team_id: null,
    home_team_name: partial.home_team_name ?? 'A',
    home_team_logo: null,
    away_team_id: null,
    away_team_name: partial.away_team_name ?? 'B',
    away_team_logo: null,
    home_goals: null,
    away_goals: null,
  }
}

function makeCatalogFixture(
  partial: Partial<DbFootballFixture> & Pick<DbFootballFixture, 'id'>
): CatalogFixtureView {
  return {
    ...makeFixture(partial),
    home_team_badge_url: null,
    away_team_badge_url: null,
  }
}

describe('groupFixturesByKickoffDate', () => {
  it('groups fixtures by date key', () => {
    const groups = groupFixturesByKickoffDate([
      makeCatalogFixture({
        id: '1',
        kickoff_at: '2026-06-15T18:00:00.000Z',
        home_team_name: 'Brasil',
        away_team_name: 'Argentina',
      }),
      makeCatalogFixture({
        id: '2',
        kickoff_at: '2026-06-15T21:00:00.000Z',
        home_team_name: 'França',
        away_team_name: 'Alemanha',
      }),
      makeCatalogFixture({
        id: '3',
        kickoff_at: '2026-06-20T18:00:00.000Z',
        home_team_name: 'Espanha',
        away_team_name: 'Portugal',
      }),
    ])

    expect(groups).toHaveLength(2)
    expect(groups[0]?.fixtures).toHaveLength(2)
    expect(groups[1]?.fixtures).toHaveLength(1)
  })
})

describe('groupTeamsByGroup', () => {
  it('groups teams by group_name', () => {
    const teams: DbFootballTeam[] = [
      {
        id: '1',
        season: 2026,
        name: 'Mexico',
        short_name: null,
        slug: 'mexico',
        country_code: null,
        flag_url: null,
        badge_url: null,
        group_name: 'Grupo A',
        is_qualified: true,
      },
      {
        id: '2',
        season: 2026,
        name: 'South Africa',
        short_name: null,
        slug: 'south-africa',
        country_code: null,
        flag_url: null,
        badge_url: null,
        group_name: 'Grupo A',
        is_qualified: true,
      },
    ]

    const groups = groupTeamsByGroup(teams)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.teams).toHaveLength(2)
  })
})
