const DEFAULT_MAX = 32

export function truncateDisplayName(
  value: string,
  maxLength = DEFAULT_MAX
): { display: string; full: string } {
  const trimmed = value.trim()
  if (trimmed.length <= maxLength) {
    return { display: trimmed, full: trimmed }
  }
  return {
    display: `${trimmed.slice(0, maxLength - 1)}…`,
    full: trimmed,
  }
}
