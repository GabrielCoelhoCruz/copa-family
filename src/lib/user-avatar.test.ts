import { describe, expect, it } from 'vitest'

import { resolveUserAvatar } from '@/lib/user-avatar'

describe('resolveUserAvatar', () => {
  it('uses photo url when present', () => {
    const result = resolveUserAvatar({
      photoUrl: 'https://cdn.example/photo.jpg',
      displayName: 'Maria Silva',
    })
    expect(result.imageUrl).toBe('https://cdn.example/photo.jpg')
    expect(result.fallback).toBe('MA')
  })

  it('falls back to initials without photo', () => {
    const result = resolveUserAvatar({
      photoUrl: null,
      displayName: 'João',
    })
    expect(result.imageUrl).toBeNull()
    expect(result.fallback).toBe('JO')
  })
})
