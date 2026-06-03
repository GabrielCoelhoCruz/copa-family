import { describe, expect, it } from 'vitest'

import { canAssumeRoom } from '@/features/rooms/host-resilience'

describe('canAssumeRoom', () => {
  const now = new Date('2026-06-02T22:00:00.000Z')

  it('allows members to assume after ten minutes of host inactivity', () => {
    expect(canAssumeRoom('2026-06-02T21:49:59.000Z', now)).toBe(true)
  })

  it('blocks takeover while the host is still active', () => {
    expect(canAssumeRoom('2026-06-02T21:55:00.000Z', now)).toBe(false)
  })
})
