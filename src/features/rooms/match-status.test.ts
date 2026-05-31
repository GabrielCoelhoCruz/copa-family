import { describe, expect, it } from 'vitest'

import {
  canTransitionMatchStatus,
  getInvalidTransitionMessage,
} from '@/features/rooms/match-status'

describe('match status transitions', () => {
  it('allows lobby to predictions_open', () => {
    expect(canTransitionMatchStatus('lobby', 'predictions_open')).toBe(true)
  })

  it('blocks finished to live', () => {
    expect(canTransitionMatchStatus('finished', 'live')).toBe(false)
    expect(getInvalidTransitionMessage('finished', 'live')).toMatch(/encerrada/i)
  })

  it('allows live to halftime and back', () => {
    expect(canTransitionMatchStatus('live', 'halftime')).toBe(true)
    expect(canTransitionMatchStatus('halftime', 'live')).toBe(true)
  })
})
