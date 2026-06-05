/** Shared Copa Stop round length (client timer + server validation). */
export const COPA_PARE_ROUND_SECONDS = 30

export function getCopaPareRoundDeadlineMs(halftimeStartedAt: string | null): number | null {
  if (!halftimeStartedAt) return null
  return new Date(halftimeStartedAt).getTime() + COPA_PARE_ROUND_SECONDS * 1000
}

export function isCopaPareRoundExpired(halftimeStartedAt: string | null, nowMs = Date.now()) {
  const deadlineMs = getCopaPareRoundDeadlineMs(halftimeStartedAt)
  if (deadlineMs == null) return false
  return nowMs > deadlineMs
}
