import type { MatchStatus } from '@/lib/types'

type CopaPareVisibilityInput = {
  status: MatchStatus
  userId: string | null
  hasCopaPareEntry: boolean
}

export function isCopaParePlayPhase(status: MatchStatus): boolean {
  return status === 'halftime'
}

export function canShowCopaPareEventPill(input: CopaPareVisibilityInput): boolean {
  return (
    isCopaParePlayPhase(input.status) &&
    input.userId != null &&
    !input.hasCopaPareEntry
  )
}
