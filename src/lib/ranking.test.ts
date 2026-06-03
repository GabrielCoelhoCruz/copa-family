import { describe, expect, it } from 'vitest'

import { withRankingPositions } from '@/lib/ranking'

describe('withRankingPositions', () => {
  it('assigns sequential positions when all scores differ', () => {
    const result = withRankingPositions([
      { userId: 'a', points: 100 },
      { userId: 'b', points: 50 },
      { userId: 'c', points: 10 },
    ])

    expect(result.map((row) => row.position)).toEqual([1, 2, 3])
  })

  it('shares position 1 when top players tie', () => {
    const result = withRankingPositions([
      { userId: 'a', points: 100 },
      { userId: 'b', points: 100 },
      { userId: 'c', points: 50 },
    ])

    expect(result.map((row) => row.position)).toEqual([1, 1, 3])
  })

  it('handles tie in the middle of the ranking', () => {
    const result = withRankingPositions([
      { userId: 'a', points: 100 },
      { userId: 'b', points: 50 },
      { userId: 'c', points: 50 },
      { userId: 'd', points: 10 },
    ])

    expect(result.map((row) => row.position)).toEqual([1, 2, 2, 4])
  })

  it('returns empty array unchanged', () => {
    expect(withRankingPositions([])).toEqual([])
  })
})
