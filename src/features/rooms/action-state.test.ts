import { describe, expect, it } from 'vitest'

import { actionStateFromZod, hasFieldErrors } from '@/features/rooms/action-state'
import { joinRoomSchema } from '@/features/rooms/schemas'

describe('actionStateFromZod', () => {
  it('mapeia erros de validação por campo', () => {
    const parsed = joinRoomSchema.safeParse({
      roomCode: 'AB',
      displayName: 'Ana',
      avatarKey: 'lion',
    })

    expect(parsed.success).toBe(false)
    if (!parsed.success) {
      const state = actionStateFromZod(parsed.error, 'Revise os campos.')
      expect(state.fieldErrors?.roomCode).toBeTruthy()
      expect(hasFieldErrors(state)).toBe(true)
    }
  })
})

describe('hasFieldErrors', () => {
  it('retorna false sem fieldErrors', () => {
    expect(hasFieldErrors({ error: 'Falha geral' })).toBe(false)
  })
})
