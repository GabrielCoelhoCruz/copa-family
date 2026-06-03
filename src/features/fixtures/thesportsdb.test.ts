import { describe, expect, it } from 'vitest'

import {
  extractCatalogFromEvents,
  mapTheSportsDbFixtureToRow,
  parseTheSportsDbScore,
  type TheSportsDbEvent,
} from '@/features/fixtures/thesportsdb'

const sampleEvent: TheSportsDbEvent = {
  idEvent: '2391728',
  strHomeTeam: 'Mexico',
  strAwayTeam: 'South Africa',
  dateEvent: '2026-06-11',
  strTime: '19:00:00',
  strGroup: 'A',
  strVenue: 'Estadio Azteca',
  strCity: 'Mexico City',
  strStatus: 'NS',
  idHomeTeam: '134496',
  idAwayTeam: '136527',
  strHomeTeamBadge: 'https://example.com/mx.png',
  strAwayTeamBadge: 'https://example.com/za.png',
  strRound: 'Group Stage - 1',
}

describe('mapTheSportsDbFixtureToRow', () => {
  it('maps provider, teams, group, and kickoff', () => {
    const row = mapTheSportsDbFixtureToRow(sampleEvent, '2026-06-02T00:00:00.000Z')
    expect(row.provider).toBe('thesportsdb')
    expect(row.provider_fixture_id).toBe(2391728)
    expect(row.season).toBe(2026)
    expect(row.home_team_name).toBe('Mexico')
    expect(row.group_name).toBe('Grupo A')
    expect(row.kickoff_at).toBe('2026-06-11T19:00:00Z')
    expect(row.venue_name).toBe('Estadio Azteca')
  })
})

describe('parseTheSportsDbScore', () => {
  it('parses numeric strings', () => {
    expect(parseTheSportsDbScore('2')).toBe(2)
    expect(parseTheSportsDbScore('')).toBeNull()
  })
})

describe('extractCatalogFromEvents', () => {
  it('deduplicates teams and venues', () => {
    const { teams, venues, fixtures } = extractCatalogFromEvents(
      [sampleEvent, { ...sampleEvent, idEvent: '2391729', strAwayTeam: 'Brazil' }],
      2026,
      '2026-06-02T00:00:00.000Z'
    )
    expect(fixtures).toHaveLength(2)
    expect(teams.length).toBeGreaterThanOrEqual(3)
    expect(venues).toHaveLength(1)
  })
})
