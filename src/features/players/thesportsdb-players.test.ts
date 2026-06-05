import { describe, expect, it } from 'vitest'

import {
  pickBestPlayerPhotoUrl,
  type TheSportsDbPlayer,
} from '@/features/players/thesportsdb-players'

describe('pickBestPlayerPhotoUrl', () => {
  it('prefers cutout over thumb for large portrait display', () => {
    const player: TheSportsDbPlayer = {
      idPlayer: '1',
      strPlayer: 'Test',
      strCutout: 'https://example.com/cutout.png',
      strThumb: 'https://example.com/thumb.jpg',
    }
    expect(pickBestPlayerPhotoUrl(player)).toBe('https://example.com/cutout.png')
  })

  it('returns null when no http urls', () => {
    const player: TheSportsDbPlayer = {
      idPlayer: '1',
      strPlayer: 'Test',
    }
    expect(pickBestPlayerPhotoUrl(player)).toBeNull()
  })
})
