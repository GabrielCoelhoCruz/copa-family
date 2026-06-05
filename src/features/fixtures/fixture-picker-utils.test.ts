import { describe, expect, it } from 'vitest'

import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  buildFixtureDateGroups,
  filterUpcomingCatalogFixtures,
  getFixturesForDateKey,
  getTodayDateKeyForPicker,
  pickDefaultBrowseDateKey,
  pickDefaultBrowsePhase,
} from '@/features/fixtures/fixture-picker-utils'
import type { DbFootballFixture } from '@/lib/types'

function makeFixture(
  partial: Partial<DbFootballFixture> & Pick<DbFootballFixture, 'id'>
): CatalogFixtureView {
  return {
    id: partial.id,
    provider: 'wc26-rapidapi',
    provider_fixture_id: 1,
    league_id: 1,
    season: 2026,
    round: partial.round ?? null,
    stage: partial.stage ?? null,
    group_name: partial.group_name ?? null,
    kickoff_at: partial.kickoff_at ?? null,
    status_short: partial.status_short ?? null,
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

describe('fixture-picker-utils', () => {
  const todayKey = '2026-06-15'
  const now = new Date('2026-06-15T15:00:00Z')

  it('returns fixtures for today date key', () => {
    const fixtures = [
      makeFixture({
        id: 'today',
        kickoff_at: '2026-06-15T18:00:00.000Z',
      }),
      makeFixture({
        id: 'tomorrow',
        kickoff_at: '2026-06-16T18:00:00.000Z',
      }),
    ]

    const today = getFixturesForDateKey(fixtures, todayKey)
    expect(today.map((f) => f.id)).toEqual(['today'])
  })

  it('prefers selected fixture date in browse default', () => {
    const selected = makeFixture({
      id: 'other-day',
      kickoff_at: '2026-06-20T18:00:00.000Z',
      round: 'Group A',
      group_name: 'Grupo A',
    })
    const fixtures = [
      selected,
      makeFixture({
        id: 'today-game',
        kickoff_at: '2026-06-15T18:00:00.000Z',
      }),
    ]

    const groups = buildFixtureDateGroups(fixtures, { todayKey, now })
    const dateKey = pickDefaultBrowseDateKey(groups, {
      todayKey,
      selectedFixture: selected,
    })

    expect(dateKey).toBe('2026-06-20')
  })

  it('defaults to today when today has games and no selection', () => {
    const fixtures = [
      makeFixture({
        id: 'today-game',
        kickoff_at: '2026-06-15T18:00:00.000Z',
      }),
      makeFixture({
        id: 'later',
        kickoff_at: '2026-06-20T18:00:00.000Z',
      }),
    ]

    const groups = buildFixtureDateGroups(fixtures, { todayKey, now })
    const dateKey = pickDefaultBrowseDateKey(groups, { todayKey })

    expect(dateKey).toBe(todayKey)
  })

  it('skips today when empty and picks next day with preferUpcoming', () => {
    const fixtures = [
      makeFixture({
        id: 'past',
        kickoff_at: '2026-06-14T18:00:00.000Z',
        status_short: 'FT',
      }),
      makeFixture({
        id: 'future',
        kickoff_at: '2026-06-18T18:00:00.000Z',
        status_short: 'NS',
      }),
    ]

    const groups = buildFixtureDateGroups(fixtures, {
      todayKey,
      now,
      preferUpcoming: true,
    })
    const dateKey = pickDefaultBrowseDateKey(groups, {
      todayKey,
      preferUpcoming: true,
    })

    expect(dateKey).toBe('2026-06-18')
    expect(filterUpcomingCatalogFixtures(fixtures, now).map((f) => f.id)).toEqual(['future'])
  })

  it('picks default phase from fixtures on the selected day', () => {
    const fixtures = [
      makeFixture({
        id: 'group-game',
        kickoff_at: '2026-06-15T18:00:00.000Z',
        round: 'Group A',
        group_name: 'Grupo A',
      }),
    ]

    const phase = pickDefaultBrowsePhase(fixtures, todayKey)
    expect(phase).toBe('grupos')
  })

  it('exposes today key helper', () => {
    expect(getTodayDateKeyForPicker('America/Sao_Paulo', now)).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
