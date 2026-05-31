import { describe, expect, it } from 'vitest'

import { truncateDisplayName } from '@/lib/display-text'

describe('truncateDisplayName', () => {
  it('mantém nomes curtos intactos', () => {
    expect(truncateDisplayName('Ana')).toEqual({
      display: 'Ana',
      full: 'Ana',
    })
  })

  it('trunca nomes longos com reticências', () => {
    const longName = 'A'.repeat(40)
    const { display, full } = truncateDisplayName(longName)
    expect(full).toBe(longName)
    expect(display.endsWith('…')).toBe(true)
    expect(display.length).toBeLessThan(full.length)
  })
})
