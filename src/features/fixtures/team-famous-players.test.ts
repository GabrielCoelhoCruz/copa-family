import { describe, expect, it } from 'vitest'

import { famousPlayersForFixture } from '@/features/fixtures/team-famous-players'

describe('famousPlayersForFixture', () => {
  it('returns famous players from both teams', () => {
    const players = famousPlayersForFixture('Mexico', 'South Africa')
    expect(players).toContain('Hirving Lozano')
    expect(players).toContain('Percy Tau')
    expect(players.length).toBe(6)
  })

  it('dedupes when teams share no players', () => {
    const players = famousPlayersForFixture('Brazil', 'Argentina')
    expect(new Set(players).size).toBe(players.length)
  })
})
