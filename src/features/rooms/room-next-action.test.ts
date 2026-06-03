import { describe, expect, it } from 'vitest'

import { resolveRoomNextAction } from './room-next-action'

describe('resolveRoomNextAction', () => {
  it('prioritizes prediction when open and user has not submitted', () => {
    const action = resolveRoomNextAction({
      roomCode: 'ABC',
      status: 'predictions_open',
      isOwner: false,
      hasPrediction: false,
      hasCopaPareEntry: false,
      predictionCount: 2,
      memberCount: 4,
    })

    expect(action.ctaLabel).toBe('Fazer palpite')
    expect(action.href).toContain('/palpites')
  })

  it('suggests Copa Pare during halftime when not played', () => {
    const action = resolveRoomNextAction({
      roomCode: 'ABC',
      status: 'halftime',
      isOwner: false,
      hasPrediction: true,
      hasCopaPareEntry: false,
      predictionCount: 4,
      memberCount: 4,
    })

    expect(action.ctaLabel).toBe('Jogar Copa Pare')
  })

  it('routes to ranking when match is finished', () => {
    const action = resolveRoomNextAction({
      roomCode: 'ABC',
      status: 'finished',
      isOwner: false,
      hasPrediction: true,
      hasCopaPareEntry: true,
      predictionCount: 5,
      memberCount: 5,
    })

    expect(action.href).toContain('/ranking')
  })

  it('points hosts to the next match flow when match is finished', () => {
    const action = resolveRoomNextAction({
      roomCode: 'ABC',
      status: 'finished',
      isOwner: true,
      hasPrediction: true,
      hasCopaPareEntry: true,
      predictionCount: 5,
      memberCount: 5,
    })

    expect(action.ctaKind).toBe('anchor')
    expect(action.anchorTargetId).toBe('proximo-jogo-heading')
  })

  it('uses anchor CTA for owner invite flow', () => {
    const action = resolveRoomNextAction({
      roomCode: 'ABC',
      status: 'lobby',
      isOwner: true,
      hasPrediction: false,
      hasCopaPareEntry: false,
      predictionCount: 0,
      memberCount: 1,
    })

    expect(action.ctaKind).toBe('anchor')
    expect(action.anchorTargetId).toBe('convite-sala')
  })
})
