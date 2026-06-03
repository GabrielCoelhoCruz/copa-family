const HOST_INACTIVITY_MS = 10 * 60 * 1000

export function canAssumeRoom(lastHostActionAt: string | null | undefined, now = new Date()) {
  if (!lastHostActionAt) return true
  return now.getTime() - new Date(lastHostActionAt).getTime() >= HOST_INACTIVITY_MS
}
