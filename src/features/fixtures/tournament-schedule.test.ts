import { describe, expect, it } from 'vitest'

import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  filterFixturesForTournamentTable,
  listGroupFilterOptions,
  listTournamentPhasesWithFixtures,
  resolveFixtureGroupLabel,
  resolveFixturePhase,
} from '@/features/fixtures/tournament-schedule'
import type { DbFootballFixture } from '@/lib/types'

function makeFixture(
  partial: Partial<DbFootballFixture> & Pick<DbFootballFixture, 'id'>
): CatalogFixtureView {
  return {
    id: partial.id,
    provider: 'api-football',
    provider_fixture_id: partial.provider_fixture_id ?? 1,
    league_id: 1,
    season: 2026,
    round: partial.round ?? null,
    stage: partial.stage ?? null,
    group_name: partial.group_name ?? null,
    kickoff_at: partial.kickoff_at ?? '2026-06-15T18:00:00.000Z',
    status_short: null,
    status_long: null,
    elapsed: null,
    venue_name: null,
    venue_city: null,
    home_team_id: null,
    home_team_name: partial.home_team_name ?? 'Brasil',
    home_team_logo: null,
    away_team_id: null,
    away_team_name: partial.away_team_name ?? 'Argentina',
    away_team_logo: null,
    home_goals: null,
    away_goals: null,
    home_team_badge_url: null,
    away_team_badge_url: null,
  }
}

describe('resolveFixturePhase', () => {
  it('detects group stage from group_name and round', () => {
    expect(
      resolveFixturePhase(
        makeFixture({ id: '1', group_name: 'Grupo A', round: 'Group Stage - 1' })
      )
    ).toBe('grupos')
    expect(
      resolveFixturePhase(makeFixture({ id: '2', round: 'Round of 16', stage: 'Oitavas' }))
    ).toBe('oitavas')
    expect(resolveFixturePhase(makeFixture({ id: '3', round: 'Final' }))).toBe('final')
  })
})

describe('filterFixturesForTournamentTable', () => {
  it('filters by phase and group letter', () => {
    const fixtures = [
      makeFixture({ id: 'a1', group_name: 'Grupo A', home_team_name: 'Mexico' }),
      makeFixture({ id: 'a2', group_name: 'Grupo A', home_team_name: 'Canada' }),
      makeFixture({ id: 'b1', group_name: 'Grupo B', home_team_name: 'Qatar' }),
      makeFixture({ id: 'r16', round: 'Round of 16', group_name: null }),
    ]

    const groupA = filterFixturesForTournamentTable(fixtures, 'grupos', 'A')
    expect(groupA).toHaveLength(2)
    expect(groupA.every((f) => resolveFixtureGroupLabel(f) === 'Grupo A')).toBe(true)

    const oitavas = filterFixturesForTournamentTable(fixtures, 'oitavas', null)
    expect(oitavas).toHaveLength(1)
  })
})

describe('listTournamentPhasesWithFixtures', () => {
  it('returns only phases that have games', () => {
    const phases = listTournamentPhasesWithFixtures([
      makeFixture({ id: '1', group_name: 'Grupo C' }),
      makeFixture({ id: '2', round: 'Quarter-finals' }),
    ])

    expect(phases.map((p) => p.id)).toEqual(['grupos', 'quartas'])
    expect(phases[0]?.count).toBe(1)
  })
})

describe('listGroupFilterOptions', () => {
  it('lists sorted group letters for group stage fixtures', () => {
    const options = listGroupFilterOptions([
      makeFixture({ id: '1', group_name: 'Grupo B' }),
      makeFixture({ id: '2', group_name: 'Grupo A' }),
      makeFixture({ id: '3', round: 'Final' }),
    ])

    expect(options).toEqual([
      { key: 'A', label: 'Grupo A' },
      { key: 'B', label: 'Grupo B' },
    ])
  })
})
