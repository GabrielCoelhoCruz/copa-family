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

export function getAvatarEmoji(avatarKey: string) {
  return AVATAR_OPTIONS.find((avatar) => avatar.key === avatarKey)?.emoji ?? '⚽'
}

export function getAvatarFallback(avatarKey: string, displayName: string) {
  const emoji = getAvatarEmoji(avatarKey)
  if (emoji !== '⚽') return emoji
  return displayName.slice(0, 2).toUpperCase()
}
