import { describe, expect, it } from 'vitest'

import {
  answerStartsWithLetter,
  normalizeCopaPareAnswer,
  normalizeInitial,
} from '@/lib/copa-pare-categories'

describe('copa-pare answer helpers', () => {
  it('normalizes accents for comparison', () => {
    expect(normalizeCopaPareAnswer('  São Paulo ')).toBe('sao paulo')
    expect(normalizeInitial('Álvarez')).toBe('a')
  })

  it('validates initial letter', () => {
    expect(answerStartsWithLetter('Messi', 'M')).toBe(true)
    expect(answerStartsWithLetter('Álvarez', 'A')).toBe(true)
    expect(answerStartsWithLetter('Brasil', 'M')).toBe(false)
    expect(answerStartsWithLetter('', 'M')).toBe(false)
  })
})
