import { describe, expect, it } from 'vitest'

import {
  buildKickoffAt,
  buildMatchTitle,
  isKnockoutPlaceholderName,
  parseGroupFromRound,
  parseGroupLetter,
  slugifyName,
  venueSlug,
} from '@/features/fixtures/normalize'

describe('slugifyName', () => {
  it('normalizes accents and spaces', () => {
    expect(slugifyName('São Paulo')).toBe('sao-paulo')
  })
})

describe('parseGroupFromRound', () => {
  it('maps group letter in round string to Portuguese label', () => {
    expect(parseGroupFromRound('Group A - 1')).toBe('Grupo A')
    expect(parseGroupFromRound('Group Stage - 1')).toBeNull()
  })
})

describe('parseGroupLetter', () => {
  it('maps single letter group to Grupo X', () => {
    expect(parseGroupLetter('A')).toBe('Grupo A')
  })
})

describe('buildKickoffAt', () => {
  it('combines date and time as UTC', () => {
    expect(buildKickoffAt('2026-06-11', '19:00:00', null)).toBe(
      '2026-06-11T19:00:00Z'
    )
  })

  it('prefers strTimestamp when provided', () => {
    expect(
      buildKickoffAt('2026-06-11', '19:00:00', '2026-06-11T19:00:00+00:00')
    ).toBe('2026-06-11T19:00:00+00:00')
  })
})

describe('buildMatchTitle', () => {
  it('includes round when present', () => {
    expect(
      buildMatchTitle('Mexico', 'South Africa', 'Group Stage - 1', 'Fase de grupos')
    ).toContain('Mexico x South Africa')
  })
})

describe('venueSlug', () => {
  it('builds stable venue slug', () => {
    expect(venueSlug('Estadio Azteca', 'Mexico City')).toBe(
      'estadio-azteca-mexico-city'
    )
  })
})

describe('isKnockoutPlaceholderName', () => {
  it('detects bracket placeholders', () => {
    expect(isKnockoutPlaceholderName('1A')).toBe(true)
    expect(isKnockoutPlaceholderName('W73')).toBe(true)
    expect(isKnockoutPlaceholderName('Brasil')).toBe(false)
  })
})
