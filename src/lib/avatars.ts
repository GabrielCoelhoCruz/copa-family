/** @deprecated Legacy emoji avatars — new users use football_players portraits. */
export const AVATAR_OPTIONS = [
  { key: 'lion', emoji: '🦁', label: 'Leão' },
  { key: 'eagle', emoji: '🦅', label: 'Águia' },
  { key: 'wolf', emoji: '🐺', label: 'Lobo' },
  { key: 'bear', emoji: '🐻', label: 'Urso' },
  { key: 'fox', emoji: '🦊', label: 'Raposa' },
  { key: 'tiger', emoji: '🐯', label: 'Tigre' },
  { key: 'panda', emoji: '🐼', label: 'Panda' },
  { key: 'owl', emoji: '🦉', label: 'Coruja' },
] as const

export type AvatarKey = (typeof AVATAR_OPTIONS)[number]['key']

/** Initials-only fallback for legacy users without a player portrait. */
export function getAvatarFallback(_avatarKey: string, displayName: string): string {
  const trimmed = displayName.trim()
  if (trimmed.length >= 2) return trimmed.slice(0, 2).toUpperCase()
  return trimmed.slice(0, 1).toUpperCase() || '?'
}
