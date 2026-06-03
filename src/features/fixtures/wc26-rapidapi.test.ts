import { describe, expect, it } from 'vitest'

import {
  extractCatalogFromWc26,
  mapWc26GroupName,
  mapWc26MatchToFixtureRow,
  mapWc26Status,
  parseWc26Kickoff,
  parseWc26Score,
  type Wc26Group,
  type Wc26Match,
} from '@/features/fixtures/wc26-rapidapi'

const sampleMatch: Wc26Match = {
  id: 1,
  home: 'Mexico',
  away: 'South Africa',
  date: '2026-06-11',
  time: '13:00 UTC-6',
  group: 'Group A',
  round: 'Matchday 1',
  venue: 'Mexico City',
  status: 'scheduled',
  score: null,
  played: false,
  minute: 0,
}

describe('parseWc26Kickoff', () => {
  it('parses date and UTC offset from time string', () => {
    expect(parseWc26Kickoff('2026-06-11', '13:00 UTC-6')).toBe(
      '2026-06-11T13:00:00-06:00'
    )
  })
})

describe('mapWc26GroupName', () => {
  it('maps Group A to Grupo A', () => {
    expect(mapWc26GroupName('Group A')).toBe('Grupo A')
  })
})

describe('mapWc26MatchToFixtureRow', () => {
  it('maps full match to fixture row', () => {
    const row = mapWc26MatchToFixtureRow(sampleMatch, '2026-06-02T00:00:00.000Z')
    expect(row.provider).toBe('wc26-rapidapi')
    expect(row.provider_fixture_id).toBe(1)
    expect(row.home_team_name).toBe('Mexico')
    expect(row.group_name).toBe('Grupo A')
    expect(row.status_short).toBe('NS')
  })
})

describe('mapWc26Status', () => {
  it('maps scheduled to NS', () => {
    expect(mapWc26Status('scheduled').short).toBe('NS')
  })
})

describe('parseWc26Score', () => {
  it('parses object and string scores', () => {
    expect(parseWc26Score({ home: 2, away: 1 })).toEqual({ home: 2, away: 1 })
    expect(parseWc26Score('3-0')).toEqual({ home: 3, away: 0 })
  })
})

describe('extractCatalogFromWc26', () => {
  it('builds teams venues and fixtures', () => {
    const groups: Wc26Group[] = [
      {
        name: 'Group A',
        teams: ['Mexico', 'South Africa', 'South Korea', 'Czech Republic'],
      },
    ]
    const { teams, venues, fixtures } = extractCatalogFromWc26(
      [sampleMatch],
      groups,
      2026,
      '2026-06-02T00:00:00.000Z'
    )
    expect(fixtures).toHaveLength(1)
    expect(teams.length).toBeGreaterThanOrEqual(4)
    expect(venues).toHaveLength(1)
  })
})
