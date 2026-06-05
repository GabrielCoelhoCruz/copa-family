import type { DbUser } from '@/lib/types'

export type UserWithPlayerPortrait = DbUser & {
  football_players?:
    | { photo_url: string | null }
    | { photo_url: string | null }[]
    | null
}

export function photoUrlFromUser(user: UserWithPlayerPortrait): string | null {
  const portrait = user.football_players
  if (!portrait) return null
  if (Array.isArray(portrait)) {
    return portrait[0]?.photo_url?.trim() || null
  }
  return portrait.photo_url?.trim() || null
}
