import { describe, expect, it } from 'vitest'

import {
  COPA_PARE_ROUND_SECONDS,
  getCopaPareRoundDeadlineMs,
  isCopaPareRoundExpired,
} from '@/lib/copa-pare-interval'

describe('copa-pare-interval', () => {
  it('returns null deadline when halftime timestamp is missing', () => {
    expect(getCopaPareRoundDeadlineMs(null)).toBeNull()
    expect(isCopaPareRoundExpired(null)).toBe(false)
  })

  it('expires after round seconds', () => {
    const startedAt = '2026-06-04T12:00:00.000Z'
    const deadline = getCopaPareRoundDeadlineMs(startedAt)!
    const before = deadline - 1
    const after = deadline + 1

    expect(isCopaPareRoundExpired(startedAt, before)).toBe(false)
    expect(isCopaPareRoundExpired(startedAt, after)).toBe(true)
    expect(deadline - new Date(startedAt).getTime()).toBe(
      COPA_PARE_ROUND_SECONDS * 1000
    )
  })
})
