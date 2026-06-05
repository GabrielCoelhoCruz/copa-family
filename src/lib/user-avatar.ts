export function resolveUserAvatar({
  photoUrl,
  displayName,
}: {
  photoUrl?: string | null
  displayName: string
}): { imageUrl: string | null; fallback: string } {
  const trimmed = displayName.trim()
  const fallback =
    trimmed.length >= 2
      ? trimmed.slice(0, 2).toUpperCase()
      : trimmed.slice(0, 1).toUpperCase() || '?'

  return {
    imageUrl: photoUrl?.trim() || null,
    fallback,
  }
}
