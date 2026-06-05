'use client'

import { RoomLiveBanner } from '@/features/rooms/live/room-live-banner'
import { useRoomLive } from '@/features/rooms/live/room-live-provider'
import { RoomShell } from '@/components/room-shell'

type RoomShellLiveProps = {
  roomCode: string
  roomName: string
  children: React.ReactNode
}

function RoomShellLive({ roomCode, roomName, children }: RoomShellLiveProps) {
  const {
    matchStatus,
    showCopaPareEvent,
    connectionState,
    activeEvent,
    dismissEvent,
  } = useRoomLive()

  return (
    <RoomShell
      roomCode={roomCode}
      roomName={roomName}
      matchStatus={matchStatus}
      showCopaPareEvent={showCopaPareEvent}
      connectionState={connectionState}
      liveBanner={
        activeEvent ? (
          <RoomLiveBanner
            event={activeEvent}
            compact={showCopaPareEvent}
            onDismiss={dismissEvent}
          />
        ) : null
      }
    >
      {children}
    </RoomShell>
  )
}

export { RoomShellLive }
