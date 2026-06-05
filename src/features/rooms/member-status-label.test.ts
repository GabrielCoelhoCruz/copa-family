import { describe, expect, it } from 'vitest'

import { buildMemberStatusLabel } from '@/features/rooms/member-status-label'

describe('buildMemberStatusLabel', () => {
  it('shows palpite status while predictions are open', () => {
    expect(buildMemberStatusLabel('predictions_open', true, false)).toBe('palpitou')
    expect(buildMemberStatusLabel('predictions_open', false, false)).toBe(
      'aguardando palpite'
    )
  })

  it('combines palpite and copa pare during halftime', () => {
    expect(buildMemberStatusLabel('halftime', true, true)).toBe(
      'palpitou · Copa Pare'
    )
  })
})
