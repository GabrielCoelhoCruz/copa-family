import { describe, expect, it } from 'vitest'

import {
  buildAnalyticsFunnel,
  calculateFunnelRate,
  calculateReturnRate,
} from '@/lib/analytics-funnel'
import { ANALYTICS_EVENTS } from '@/lib/analytics'

describe('analytics funnel helpers', () => {
  it('calculates host completion from created rooms to submitted results', () => {
    const funnel = buildAnalyticsFunnel([
      { eventName: ANALYTICS_EVENTS.roomCreated, count: 4 },
      { eventName: ANALYTICS_EVENTS.matchResultSubmitted, count: 3 },
    ])

    expect(calculateFunnelRate(funnel, 'rooms', 'results')).toBe(75)
  })

  it('calculates return rate from joined users to ranking views', () => {
    expect(calculateReturnRate({ returned: 2, eligible: 5 })).toBe(40)
    expect(calculateReturnRate({ returned: 0, eligible: 0 })).toBe(0)
  })
})
