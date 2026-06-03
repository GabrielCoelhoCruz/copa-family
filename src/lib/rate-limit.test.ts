import { describe, expect, it } from 'vitest'

import { createRateLimitStore, consumeRateLimit } from '@/lib/rate-limit'

describe('consumeRateLimit', () => {
  it('allows requests until the window limit is reached', () => {
    const store = createRateLimitStore()
    const first = consumeRateLimit({
      store,
      key: 'create:ip-1',
      limit: 2,
      windowMs: 1_000,
      nowMs: 1_000,
    })
    const second = consumeRateLimit({
      store,
      key: 'create:ip-1',
      limit: 2,
      windowMs: 1_000,
      nowMs: 1_100,
    })
    const third = consumeRateLimit({
      store,
      key: 'create:ip-1',
      limit: 2,
      windowMs: 1_000,
      nowMs: 1_200,
    })

    expect(first.allowed).toBe(true)
    expect(second.allowed).toBe(true)
    expect(third.allowed).toBe(false)
    expect(third.retryAfterSeconds).toBe(1)
  })

  it('resets after the window expires', () => {
    const store = createRateLimitStore()

    consumeRateLimit({
      store,
      key: 'join:ABC123',
      limit: 1,
      windowMs: 1_000,
      nowMs: 1_000,
    })
    const result = consumeRateLimit({
      store,
      key: 'join:ABC123',
      limit: 1,
      windowMs: 1_000,
      nowMs: 2_001,
    })

    expect(result.allowed).toBe(true)
  })
})
