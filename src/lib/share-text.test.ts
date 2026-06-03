import { describe, expect, it } from 'vitest'

import { buildScoreShareText, sanitizeShareText } from '@/lib/share-text'

describe('sanitizeShareText', () => {
  it('removes control characters and trims long text', () => {
    const value = sanitizeShareText(` Família\n<script>alert(1)</script>\u0000 ${'A'.repeat(260)}`)

    expect(value).not.toContain('<')
    expect(value).not.toContain('>')
    expect(value).not.toContain('\u0000')
    expect(value.length).toBeLessThanOrEqual(180)
  })
})

describe('buildScoreShareText', () => {
  it('builds a safe room score share message', () => {
    const text = buildScoreShareText({
      displayName: 'Ana <3',
      roomName: 'Família Copa',
      position: 2,
      points: 120,
      predictionCount: 3,
      copaPareCount: 1,
      inviteUrl: 'https://example.com/entrar?code=ABC123',
    })

    expect(text).toContain('Ana 3')
    expect(text).toContain('2º')
    expect(text).toContain('120 pts')
    expect(text).toContain('https://example.com/entrar?code=ABC123')
  })
})
