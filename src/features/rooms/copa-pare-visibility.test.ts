import { describe, expect, it } from 'vitest'

import { canShowCopaPareEventPill } from './copa-pare-visibility'

describe('canShowCopaPareEventPill', () => {
  it('hides during live play so Copa Pare stays an interval ritual', () => {
    expect(
      canShowCopaPareEventPill({
        status: 'live',
        userId: 'user-1',
        hasCopaPareEntry: false,
      })
    ).toBe(false)
  })

  it('shows at halftime, logged in, and no entry yet', () => {
    expect(
      canShowCopaPareEventPill({
        status: 'halftime',
        userId: 'user-1',
        hasCopaPareEntry: false,
      })
    ).toBe(true)
  })

  it('hides when user already played', () => {
    expect(
      canShowCopaPareEventPill({
        status: 'halftime',
        userId: 'user-1',
        hasCopaPareEntry: true,
      })
    ).toBe(false)
  })

  it('hides in lobby', () => {
    expect(
      canShowCopaPareEventPill({
        status: 'lobby',
        userId: 'user-1',
        hasCopaPareEntry: false,
      })
    ).toBe(false)
  })
})
