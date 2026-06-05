const AVATAR_COLORS = [
  '#3b82f6',
  '#ec4899',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ef4444',
] as const

function avatarColorForName(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length
  }
  return AVATAR_COLORS[hash] ?? AVATAR_COLORS[0]
}

export { AVATAR_COLORS, avatarColorForName }
