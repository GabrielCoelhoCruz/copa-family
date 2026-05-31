import Link from 'next/link'
import { Lock, Target } from 'lucide-react'
import { notFound } from 'next/navigation'

import { PredictionForm } from '@/components/prediction-form'
import { SuccessBanner } from '@/components/success-banner'
import { EmptyState } from '@/components/patterns/empty-state'
import { PredictionCard } from '@/components/patterns/prediction-card'
import { getRoomContext, getUserPrediction } from '@/features/rooms/queries'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { getGuestUserId } from '@/lib/session'
import { cn } from '@/lib/utils'

type PalpitesPageProps = {
  params: Promise<{ roomCode: string }>
  searchParams: Promise<{ enviado?: string }>
}

export default async function PalpitesPage({
  params,
  searchParams,
}: PalpitesPageProps) {
  const { roomCode } = await params
  const { enviado } = await searchParams
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const { room, match } = context
  const userId = await getGuestUserId()

  if (!userId) {
    return (
      <EmptyState
        icon={<Target className="size-6" />}
        title="Entre na sala primeiro"
        description="Você precisa entrar com seu nome e avatar antes de enviar palpite."
        action={
          <Link
            href={routes.entrarComCodigo(room.code)}
            className={cn(buttonVariants({ variant: 'party' }), 'min-h-11')}
          >
            Entrar com código {room.code}
          </Link>
        }
      />
    )
  }

  const existing = await getUserPrediction(match.id, userId)

  if (existing) {
    return (
      <div className="flex flex-col gap-4">
        {enviado ? (
          <SuccessBanner
            title="Palpite salvo"
            description="Você ganhou +10 pontos nesta partida."
          />
        ) : null}
      <PredictionCard
        title="Palpite salvo"
        description="Você ganhou +10 pontos. Quando o jogo começar, o ranking é atualizado."
        state="submitted"
      >
        <dl className="grid gap-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-border pb-2">
            <dt className="text-muted-foreground">Vencedor</dt>
            <dd className="font-semibold">{existing.winner}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border pb-2">
            <dt className="text-muted-foreground">Placar</dt>
            <dd className="font-heading text-lg font-bold tabular-nums">
              {existing.home_score} × {existing.away_score}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Craque</dt>
            <dd className="font-semibold">{existing.player_of_match}</dd>
          </div>
        </dl>
      </PredictionCard>
      </div>
    )
  }

  if (enviado) {
    return (
      <SuccessBanner
        title="Palpite salvo"
        description="Você ganhou +10 pontos. Confira o ranking na aba ao lado."
      />
    )
  }

  if (match.status !== 'predictions_open') {
    return (
      <EmptyState
        icon={<Lock className="size-6" />}
        title="Palpites fechados"
        description={
          match.status === 'lobby'
            ? 'O dono da sala ainda não abriu os palpites. Fique no lobby e aguarde.'
            : 'O jogo já começou — não dá mais para enviar palpite nesta partida.'
        }
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

  return (
    <PredictionForm
      matchId={match.id}
      roomId={room.id}
      roomCode={room.code}
      userId={userId}
    />
  )
}
