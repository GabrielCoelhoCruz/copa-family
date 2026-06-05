import { describe, expect, it } from 'vitest'

import { resolveStatusEvent } from './room-status-events'

const CODE = 'ABC123'

describe('resolveStatusEvent', () => {
  it('returns null when status unchanged', () => {
    expect(
      resolveStatusEvent({
        roomCode: CODE,
        previousStatus: 'live',
        nextStatus: 'live',
        showCopaPareEvent: false,
      })
    ).toBeNull()
  })

  it('returns null when previous is null and not new match', () => {
    expect(
      resolveStatusEvent({
        roomCode: CODE,
        previousStatus: null,
        nextStatus: 'lobby',
        showCopaPareEvent: false,
      })
    ).toBeNull()
  })

  it('returns predictions_open event', () => {
    const event = resolveStatusEvent({
      roomCode: CODE,
      previousStatus: 'lobby',
      nextStatus: 'predictions_open',
      showCopaPareEvent: false,
    })
    expect(event?.title).toBe('Palpites abertos')
    expect(event?.href).toContain('/palpites')
  })

  it('returns compact halftime when Copa Pare pill visible', () => {
    const event = resolveStatusEvent({
      roomCode: CODE,
      previousStatus: 'live',
      nextStatus: 'halftime',
      showCopaPareEvent: true,
    })
    expect(event?.compactTitle).toContain('Copa Stop')
    expect(event?.href).toContain('/copa-pare')
  })

  it('returns new match event', () => {
    const event = resolveStatusEvent({
      roomCode: CODE,
      previousStatus: 'finished',
      nextStatus: 'lobby',
      showCopaPareEvent: false,
      isNewMatch: true,
    })
    expect(event?.title).toBe('Novo jogo na sala')
  })
})
