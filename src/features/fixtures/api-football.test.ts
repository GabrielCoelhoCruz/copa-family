import { describe, expect, it } from 'vitest'

import {
  buildMatchTitleFromFixture,
  mapApiFootballFixtureToRow,
  type ApiFootballFixtureItem,
} from '@/features/fixtures/api-football'

const sampleFixture: ApiFootballFixtureItem = {
  fixture: {
    id: 1001,
    date: '2026-06-15T18:00:00+00:00',
    timestamp: 1781604000,
    status: { short: 'NS', long: 'Not Started', elapsed: null },
    venue: { name: 'MetLife Stadium', city: 'East Rutherford' },
  },
  league: { id: 1, season: 2026, round: 'Group A - 1' },
  teams: {
    home: { id: 10, name: 'Brasil', logo: null, winner: null },
    away: { id: 20, name: 'Argentina', logo: null, winner: null },
  },
  goals: { home: null, away: null },
}

describe('mapApiFootballFixtureToRow', () => {
  it('maps provider ids and team names', () => {
    const row = mapApiFootballFixtureToRow(sampleFixture, '2026-06-01T00:00:00.000Z')
    expect(row.provider_fixture_id).toBe(1001)
    expect(row.league_id).toBe(1)
    expect(row.season).toBe(2026)
    expect(row.home_team_name).toBe('Brasil')
    expect(row.away_team_name).toBe('Argentina')
    expect(row.group_name).toBe('Grupo A')
    expect(row.stage).toBe('Fase de grupos')
    expect(row.venue_name).toBe('MetLife Stadium')
  })
})

describe('buildMatchTitleFromFixture', () => {
  it('includes round in title when present', () => {
    const title = buildMatchTitleFromFixture({
      home_team_name: 'Brasil',
      away_team_name: 'Argentina',
      round: 'Group Stage - 1',
      stage: 'Fase de grupos',
    })
    expect(title).toContain('Brasil x Argentina')
    expect(title).toContain('Group Stage')
  })
})
