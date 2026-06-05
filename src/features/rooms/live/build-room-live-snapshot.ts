import { canShowCopaPareEventPill } from '@/features/rooms/copa-pare-visibility'
import type { MatchStatus } from '@/lib/types'

import { roomLiveRevision, type RoomLiveSnapshot } from './room-live-types'

type BuildRoomLiveSnapshotInput = {
  matchId: string
  status: MatchStatus
  userId: string | null
  hasCopaPareEntry: boolean
}

export function buildRoomLiveSnapshot(input: BuildRoomLiveSnapshotInput): RoomLiveSnapshot {
  const showCopaPareEvent = canShowCopaPareEventPill({
    status: input.status,
    userId: input.userId,
    hasCopaPareEntry: input.hasCopaPareEntry,
  })

  const snapshot = {
    matchId: input.matchId,
    status: input.status,
    showCopaPareEvent,
  }

  return {
    ...snapshot,
    revision: roomLiveRevision(snapshot),
  }
}
