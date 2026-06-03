import { describe, expect, it } from 'vitest'

import {
  countDistinctGroups,
  countDistinctVenueNames,
  daysUntilFirstKickoff,
  enrichFixturesWithTeamBadges,
} from '@/features/fixtures/catalog-view'
import type { DbFootballFixture, DbFootballTeam } from '@/lib/types'

function makeFixture(
  partial: Partial<DbFootballFixture> & Pick<DbFootballFixture, 'id'>
): DbFootballFixture {
  return {
    id: partial.id,
    provider: 'wc26-rapidapi',
    provider_fixture_id: 1,
    league_id: 1,
    season: 2026,
    round: null,
    stage: null,
    group_name: null,
    kickoff_at: partial.kickoff_at ?? null,
    status_short: null,
    status_long: null,
    elapsed: null,
    venue_name: partial.venue_name ?? null,
    venue_city: null,
    home_team_id: null,
    home_team_name: partial.home_team_name ?? 'Brasil',
    home_team_logo: null,
    away_team_id: null,
    away_team_name: partial.away_team_name ?? 'Argentina',
    away_team_logo: null,
    home_goals: null,
    away_goals: null,
  }
}

describe('enrichFixturesWithTeamBadges', () => {
  it('attaches badge urls from football_teams', () => {
    const teams: DbFootballTeam[] = [
      {
        id: '1',
        season: 2026,
        name: 'Brasil',
        short_name: null,
        slug: 'brasil',
        country_code: 'BR',
        flag_url: null,
        badge_url: 'https://flagcdn.com/w80/br.png',
        group_name: 'Grupo D',
        is_qualified: true,
      },
    ]

    const [view] = enrichFixturesWithTeamBadges(
      [makeFixture({ id: 'f1', home_team_name: 'Brasil', away_team_name: 'Argentina' })],
      teams
    )

    expect(view?.home_team_badge_url).toBe('https://flagcdn.com/w80/br.png')
    expect(view?.away_team_badge_url).toBeTruthy()
  })

  it('does not flagcdn-resolve knockout placeholders', () => {
    const [view] = enrichFixturesWithTeamBadges(
      [makeFixture({ id: 'f2', home_team_name: '1A', away_team_name: '2B' })],
      []
    )

    expect(view?.home_team_badge_url).toBeNull()
    expect(view?.away_team_badge_url).toBeNull()
  })
})

describe('catalog summary helpers', () => {
  it('counts distinct groups and venues', () => {
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

    expect(countDistinctGroups(teams)).toBe(1)
    expect(
      countDistinctVenueNames([
        makeFixture({ id: '1', venue_name: 'Estádio A' }),
        makeFixture({ id: '2', venue_name: 'Estádio A' }),
        makeFixture({ id: '3', venue_name: 'Estádio B' }),
      ])
    ).toBe(2)
  })

  it('computes days until first upcoming kickoff', () => {
    const future = new Date()
    future.setDate(future.getDate() + 10)
    const days = daysUntilFirstKickoff([
      makeFixture({ id: '1', kickoff_at: future.toISOString() }),
    ])
    expect(days).toBeGreaterThanOrEqual(9)
    expect(days).toBeLessThanOrEqual(11)
  })
})
