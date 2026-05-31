import { describe, expect, it } from 'vitest'

import {
  createRoomSchema,
  joinRoomSchema,
  predictionSchema,
} from '@/features/rooms/schemas'

describe('joinRoomSchema', () => {
  it('aceita código em minúsculas e normaliza para maiúsculas', () => {
    const result = joinRoomSchema.safeParse({
      roomCode: 'abc123',
      displayName: 'Ana',
      avatarKey: 'lion',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.roomCode).toBe('ABC123')
    }
  })

  it('rejeita código curto', () => {
    const result = joinRoomSchema.safeParse({
      roomCode: 'AB',
      displayName: 'Ana',
      avatarKey: 'lion',
    })
    expect(result.success).toBe(false)
  })
})

describe('createRoomSchema', () => {
  it('exige nome e sala com tamanho mínimo', () => {
    const result = createRoomSchema.safeParse({
      displayName: 'Jo',
      avatarKey: 'lion',
      roomName: 'X',
    })
    expect(result.success).toBe(false)
  })
})

describe('predictionSchema', () => {
  it('converte placar de string para número', () => {
    const result = predictionSchema.safeParse({
      matchId: '00000000-0000-4000-8000-000000000001',
      roomId: '00000000-0000-4000-8000-000000000002',
      winner: 'Brasil',
      homeScore: '2',
      awayScore: '1',
      playerOfMatch: 'Neymar',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.homeScore).toBe(2)
      expect(result.data.awayScore).toBe(1)
    }
  })
})
