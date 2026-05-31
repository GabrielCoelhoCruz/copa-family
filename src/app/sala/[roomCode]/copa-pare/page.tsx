import Link from 'next/link'
import { PartyPopper } from 'lucide-react'
import { notFound } from 'next/navigation'

import { CopaPareForm } from '@/components/copa-pare-form'
import { EmptyState } from '@/components/patterns/empty-state'
import { getCopaPareEntry, getRoomContext } from '@/features/rooms/queries'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CopaParePageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{ enviado?: string }>
}

const CATEGORY_LABELS: Record<string, string> = {
  player: 'Jogador',
  team: 'Seleção',
  coach: 'Técnico',
  stadium: 'Estádio',
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
  const canPlay = match.status === 'halftime' || match.status === 'live'
  const existing =
    userId != null
      ? await getCopaPareEntry(match.id, userId)
      : null

  if (!canPlay) {
    return (
      <EmptyState
        icon={<PartyPopper className="size-6" />}
        title="Copa Pare no intervalo"
        description="Peça ao anfitrião para abrir o intervalo. Aí você responde em 30 segundos e ganha +100 pts."
        action={
          <Link
            href={routes.sala(room.code)}
            className={cn(buttonVariants({ variant: 'outline' }), 'min-h-11')}
          >
            Voltar ao lobby
          </Link>
        }
      />
    )
  }

  if (existing || enviado === '1') {
    return (
      <div className="flex flex-col gap-4">
        <div
          className="rounded-2xl border border-match-finished/35 bg-gradient-to-br from-match-finished/15 to-card p-4 text-sm shadow-sm"
          role="status"
        >
          <p className="font-semibold text-foreground">Você já entrou no Copa Pare!</p>
          {existing ? (
            <p className="mt-1 text-muted-foreground">
              {CATEGORY_LABELS[existing.category] ?? existing.category}:{' '}
              <span className="font-medium text-foreground">{existing.answer}</span>
            </p>
          ) : null}
          <p className="mt-2 text-muted-foreground">+100 pts na sua conta.</p>
        </div>
        <Link
          href={routes.ranking(room.code)}
          className={cn(buttonVariants({ variant: 'party' }), 'min-h-11 w-full')}
        >
          Ver ranking
        </Link>
      </div>
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
    <CopaPareForm
      matchId={match.id}
      roomId={room.id}
      roomCode={room.code}
      userId={userId}
    />
  )
}
