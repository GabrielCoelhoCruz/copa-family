import { describe, it, expect } from 'vitest'
import { buildWhatsAppShareUrl, buildRoomInviteWhatsAppText } from './whatsapp-share'

describe('buildWhatsAppShareUrl', () => {
  it('encodes text into wa.me URL', () => {
    const url = buildWhatsAppShareUrl({ text: 'Hello world' })
    expect(url).toBe('https://wa.me/?text=Hello%20world')
  })

  it('handles special characters', () => {
    const url = buildWhatsAppShareUrl({ text: 'Copa & Família! 🏆' })
    expect(url).toContain('Copa%20%26%20Fam%C3%ADlia!')
  })

  it('handles newlines', () => {
    const url = buildWhatsAppShareUrl({ text: 'Line 1\nLine 2' })
    expect(url).toContain('%0A')
  })

  it('does not double-encode', () => {
    const url = buildWhatsAppShareUrl({ text: 'already%20encoded' })
    // encodeURIComponent will encode the % sign itself
    expect(url).toContain('%2520')
    // This is expected behavior — we encode whatever text we receive
  })
})

describe('buildRoomInviteWhatsAppText', () => {
  it('includes room code and invite URL', () => {
    const text = buildRoomInviteWhatsAppText('abc123', 'https://copa-family.vercel.app/entrar?code=ABC123')
    expect(text).toContain('ABC123')
    expect(text).toContain('https://copa-family.vercel.app/entrar?code=ABC123')
    expect(text).toContain('Copa Family')
  })

  it('uppercases the room code', () => {
    const text = buildRoomInviteWhatsAppText('xyz789', 'https://example.com')
    expect(text).toContain('XYZ789')
    expect(text).not.toContain('xyz789')
  })

  it('includes trophy emoji and call-to-action', () => {
    const text = buildRoomInviteWhatsAppText('ABC123', 'https://example.com')
    expect(text).toContain('🏆')
    expect(text).toContain('Vem jogar')
  })

  it('produces multi-line text with blank lines between sections', () => {
    const text = buildRoomInviteWhatsAppText('TEST01', 'https://example.com')
    const lines = text.split('\n')
    expect(lines.length).toBeGreaterThanOrEqual(4)
    expect(lines[0]).toBe('Vem jogar Copa Family com a gente! 🏆')
    expect(lines[1]).toBe('')
    expect(lines[2]).toContain('TEST01')
    expect(lines[3]).toBe('')
    expect(lines[4]).toContain('Entrar:')
  })
})
