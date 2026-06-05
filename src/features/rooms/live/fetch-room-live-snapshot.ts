import type { RoomLiveSnapshot } from './room-live-types'

export async function fetchRoomLiveSnapshot(roomCode: string): Promise<RoomLiveSnapshot | null> {
  const response = await fetch(`/api/rooms/${encodeURIComponent(roomCode)}/live`, {
    method: 'GET',
    cache: 'no-store',
    credentials: 'same-origin',
  })

  if (!response.ok) {
    return null
  }

  return (await response.json()) as RoomLiveSnapshot
}
