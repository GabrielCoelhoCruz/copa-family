import { notFound } from 'next/navigation'

import { RoomShell } from '@/components/room-shell'
import { getRoomContext } from '@/features/rooms/queries'

type SalaLayoutProps = {
  children: React.ReactNode
  params: Promise<{ roomCode: string }>
}

export default async function SalaLayout({ children, params }: SalaLayoutProps) {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  return (
    <RoomShell
      roomCode={context.room.code}
      roomName={context.room.name}
      matchStatus={context.match.status}
    >
      {children}
    </RoomShell>
  )
}
