import { describe, expect, it } from 'vitest'

import { buildRoomLiveSnapshot } from './build-room-live-snapshot'

describe('buildRoomLiveSnapshot', () => {
  it('shows Copa Pare pill at halftime without entry', () => {
    const snapshot = buildRoomLiveSnapshot({
      matchId: 'm1',
      status: 'halftime',
      userId: 'u1',
      hasCopaPareEntry: false,
    })
    expect(snapshot.showCopaPareEvent).toBe(true)
    expect(snapshot.revision).toBe('m1:halftime:1')
  })

  it('hides pill when user already played', () => {
    const snapshot = buildRoomLiveSnapshot({
      matchId: 'm1',
      status: 'halftime',
      userId: 'u1',
      hasCopaPareEntry: true,
    })
    expect(snapshot.showCopaPareEvent).toBe(false)
  })

  it('hides pill without user session', () => {
    const snapshot = buildRoomLiveSnapshot({
      matchId: 'm1',
      status: 'halftime',
      userId: null,
      hasCopaPareEntry: false,
    })
    expect(snapshot.showCopaPareEvent).toBe(false)
  })
})
