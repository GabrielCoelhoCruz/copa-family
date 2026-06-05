import type { MatchStatus } from '@/lib/types'

export type RoomLiveSnapshot = {
  matchId: string
  status: MatchStatus
  showCopaPareEvent: boolean
  revision: string
}

export function roomLiveRevision(snapshot: Pick<RoomLiveSnapshot, 'matchId' | 'status' | 'showCopaPareEvent'>) {
  return `${snapshot.matchId}:${snapshot.status}:${snapshot.showCopaPareEvent ? '1' : '0'}`
}
