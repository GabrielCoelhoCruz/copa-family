import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import { RoomShell } from '@/components/room-shell'
import { fixtureDisplayTitle } from '@/features/fixtures/format'
import { canShowCopaPareEventPill } from '@/features/rooms/copa-pare-visibility'
import { getCopaPareEntry, getRoomContext } from '@/features/rooms/queries'
import { getGuestUserId } from '@/lib/session'

type SalaLayoutProps = {
  children: React.ReactNode
  params: Promise<{ roomCode: string }>
}

type SalaMetadataProps = {
  params: Promise<{ roomCode: string }>
}

export async function generateMetadata({ params }: SalaMetadataProps): Promise<Metadata> {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    return {}
  }

  const matchTitle = context.fixture
    ? fixtureDisplayTitle(context.fixture)
    : context.match.title
  const title = `${context.room.name} · Copa Family`
  const description = `Entre na sala ${context.room.code} para palpitar em ${matchTitle} e jogar Copa Pare no intervalo.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function SalaLayout({ children, params }: SalaLayoutProps) {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const userId = await getGuestUserId()
  const copaPareEntry =
    userId != null
      ? await getCopaPareEntry(context.match.id, userId)
      : null

  const showCopaPareEvent = canShowCopaPareEventPill({
    status: context.match.status,
    userId,
    hasCopaPareEntry: copaPareEntry != null,
  })

  return (
    <RoomShell
      roomCode={context.room.code}
      roomName={context.room.name}
      matchStatus={context.match.status}
      showCopaPareEvent={showCopaPareEvent}
    >
      {children}
    </RoomShell>
  )
}
