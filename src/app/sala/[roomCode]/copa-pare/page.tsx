import Link from 'next/link'
import { PartyPopper } from 'lucide-react'
import { notFound } from 'next/navigation'

import { CopaParePlay } from '@/components/copa-pare-play'
import { CopaPareSuccess } from '@/components/patterns/copa-pare-success'
import { EmptyState } from '@/components/patterns/empty-state'
import { isCopaParePlayPhase } from '@/features/rooms/copa-pare-visibility'
import { getCopaPareEntry, getRoomContext } from '@/features/rooms/queries'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CopaParePageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{ enviado?: string }>
}

import { COPA_PARE_CATEGORY_LABELS, type CopaPareCategoryValue } from '@/lib/copa-pare-categories'

export default async function CopaParePage({
  params,
  searchParams,
}: CopaParePageProps) {
  const { roomCode } = await params
  const { enviado } = await searchParams
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const userId = await getGuestUserId()
  const { room, match } = context
  const canPlay = isCopaParePlayPhase(match.status)
  const existing =
    userId != null ? await getCopaPareEntry(match.id, userId) : null

  if (!canPlay) {
    return (
      <EmptyState
        icon={<PartyPopper className="size-6" />}
        title="Copa Pare no intervalo"
        description="Quando o anfitrião abrir o intervalo, o botão Copa Pare aparece na tela Jogo (+100 pts). Durante o ao vivo, use as reações rápidas da sala."
        action={
          <Link
            href={routes.sala(room.code)}
            className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')}
          >
            Voltar ao jogo
          </Link>
        }
      />
    )
  }

  if (existing || enviado === '1') {
    return (
      <CopaPareSuccess
        categoryLabel={
          existing
            ? (COPA_PARE_CATEGORY_LABELS[existing.category as CopaPareCategoryValue] ??
              existing.category)
            : undefined
        }
        answer={existing?.answer}
        rankingHref={routes.ranking(room.code)}
        roomCode={room.code}
      />
    )
  }

  if (!userId) {
    return (
      <EmptyState
        icon={<PartyPopper className="size-6" />}
        title="Entre na sala"
        description="Volte pelo link de convite para participar do Copa Pare."
      />
    )
  }

  return (
    <CopaParePlay
      matchId={match.id}
      roomId={room.id}
      roomCode={room.code}
      seed={`${match.id}-${userId}`}
    />
  )
}
