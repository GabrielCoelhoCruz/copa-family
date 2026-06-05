import Link from 'next/link'
import { PartyPopper } from 'lucide-react'
import { notFound } from 'next/navigation'

import { CopaParePlay } from '@/components/copa-pare-play'
import { CopaPareSuccess } from '@/components/patterns/copa-pare-success'
import { EmptyState } from '@/components/patterns/empty-state'
import { isCopaParePlayPhase } from '@/features/rooms/copa-pare-visibility'
import { getCopaPareEntry, getRoomContext } from '@/features/rooms/queries'
import {
  copaPareCategoryLabel,
  getCopaPareCategoryByValue,
} from '@/lib/copa-pare-categories'
import { POINTS } from '@/features/points/rules'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CopaParePageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{ enviado?: string }>
}

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
  const category = match.copa_pare_category
    ? getCopaPareCategoryByValue(match.copa_pare_category)
    : null

  if (!canPlay) {
    return (
      <EmptyState
        icon={<PartyPopper className="size-6" />}
        title="Copa Stop no intervalo"
        description={`Quando o anfitrião abrir o intervalo, o Copa Stop aparece na tela Jogo (+${POINTS.copaPareParticipation} pts, +${POINTS.copaPareUnique} se único). Durante o ao vivo, use as reações rápidas da sala.`}
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
            ? copaPareCategoryLabel(existing.category)
            : category?.label
        }
        answer={existing?.answer}
        letter={match.copa_pare_letter}
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
        description="Volte pelo link de convite para participar do Copa Stop."
      />
    )
  }

  if (!category || !match.copa_pare_letter) {
    return (
      <EmptyState
        icon={<PartyPopper className="size-6" />}
        title="Aguardando o sorteio"
        description="O anfitrião precisa abrir o intervalo para sortear categoria e letra do Copa Stop."
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

  return (
    <CopaParePlay
      matchId={match.id}
      roomId={room.id}
      roomCode={room.code}
      categoryValue={category.value}
      letter={match.copa_pare_letter}
      halftimeStartedAt={match.halftime_started_at}
    />
  )
}
