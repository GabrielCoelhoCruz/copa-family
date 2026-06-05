import { describe, expect, it } from 'vitest'

import { calculateCopaPareUniqueRows } from '@/features/points/score-copa-pare'

describe('calculateCopaPareUniqueRows', () => {
  const scope = { roomId: 'room-1', matchId: 'match-1' }

  it('awards unique answers only', () => {
    const rows = calculateCopaPareUniqueRows(
      [
        { user_id: 'u1', answer: 'Messi' },
        { user_id: 'u2', answer: 'Mbappé' },
        { user_id: 'u3', answer: 'Messi' },
      ],
      scope
    )

    expect(rows).toHaveLength(1)
    expect(rows[0]?.user_id).toBe('u2')
    expect(rows[0]?.amount).toBe(10)
  })

  it('treats normalized duplicates as repeated', () => {
    const rows = calculateCopaPareUniqueRows(
      [
        { user_id: 'u1', answer: 'São Paulo' },
        { user_id: 'u2', answer: 'sao paulo' },
      ],
      scope
    )

    expect(rows).toHaveLength(0)
  })
})
