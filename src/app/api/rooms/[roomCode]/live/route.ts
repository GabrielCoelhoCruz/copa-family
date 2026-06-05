import { NextResponse } from 'next/server'

import { buildRoomLiveSnapshot } from '@/features/rooms/live/build-room-live-snapshot'
import { getCopaPareEntry, getCurrentMatch, getRoomByCode } from '@/features/rooms/queries'
import { getGuestUserId } from '@/lib/session'

type RouteContext = {
  params: Promise<{ roomCode: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { roomCode } = await context.params
  const room = await getRoomByCode(roomCode)

  if (!room) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 })
  }

  const match = await getCurrentMatch(room.id)
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 })
  }

  const userId = await getGuestUserId()
  const copaPareEntry =
    userId != null ? await getCopaPareEntry(match.id, userId) : null

  const snapshot = buildRoomLiveSnapshot({
    matchId: match.id,
    status: match.status,
    userId,
    hasCopaPareEntry: copaPareEntry != null,
  })

  return NextResponse.json(snapshot, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
