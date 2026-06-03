import type { CSSProperties } from 'react'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { notFound } from 'next/navigation'

import { PageSection } from '@/components/layouts/page-section'
import { EmptyState } from '@/components/patterns/empty-state'
import { RankRow } from '@/components/patterns/rank-row'
import { getMatchRanking, getRanking, getRoomContext } from '@/features/rooms/queries'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { getAvatarFallback } from '@/lib/avatars'
import { routes } from '@/lib/routes'
import { withRankingPositions } from '@/lib/ranking'
import { getGuestUserId } from '@/lib/session'

type RankingPageProps = {
  params: Promise<{ roomCode: string }>
}

export default async function RankingPage({ params }: RankingPageProps) {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const userId = await getGuestUserId()
  await trackEvent({
    eventName: ANALYTICS_EVENTS.rankingViewed,
    roomId: context.room.id,
    matchId: context.match.id,
    userId: userId ?? undefined,
  })

  const [ranking, matchRanking] = await Promise.all([
    getRanking(context.room.id),
    getMatchRanking(context.room.id, context.match.id),
  ])
  const accumulatedRanking = withRankingPositions(ranking)
  const currentMatchRanking = withRankingPositions(matchRanking)
  const myEntry =
    userId != null ? accumulatedRanking.find((e) => e.userId === userId) : null

  if (accumulatedRanking.length === 0) {
    return (
      <EmptyState
        icon={<Crown className="size-6" />}
        title="Ranking vazio"
        description="Quando alguém enviar um palpite, os pontos aparecem aqui."
      />
    )
  }

  return (
    <>
      {myEntry != null ? (
        <p className="rounded-xl border border-brand-trophy/30 bg-brand-trophy/10 px-4 py-3 text-center font-heading text-lg font-bold">
          Você está em {myEntry.position}º ·{' '}
          {myEntry.points.toLocaleString('pt-BR')} pts
          <Link
            href={routes.perfil(context.room.code)}
            className="mt-2 block text-center text-xs font-semibold text-primary underline-offset-4 hover:underline"
          >
            Ver detalhe no perfil
          </Link>
        </p>
      ) : null}

      <ul
        className="grid gap-1.5 rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm text-muted-foreground"
        aria-label="Como os pontos valem"
      >
        <li>+10 palpite</li>
        <li>+50 vencedor ou craque</li>
        <li>+100 placar ou Copa Pare</li>
      </ul>

      <PageSection title="Ranking da sala" titleId="ranking-sala-heading">
        <ul className="cf-stagger-children flex flex-col gap-2">
          {accumulatedRanking.map((entry, index) => (
            <li
              key={entry.userId}
              style={{ '--cf-i': Math.min(index, 9) } as CSSProperties}
            >
              <RankRow
                position={entry.position}
                name={entry.displayName}
                points={entry.points}
                fallback={getAvatarFallback(entry.avatarKey, entry.displayName)}
                isCurrentUser={entry.userId === userId}
                detail="Acumulado em todos os jogos"
              />
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection
        title="Ranking da partida"
        titleId="ranking-partida-heading"
        description="Mostra só os pontos do jogo atual."
      >
        <ul className="flex flex-col gap-2">
          {currentMatchRanking.map((entry) => (
            <li key={entry.userId}>
              <RankRow
                position={entry.position}
                name={entry.displayName}
                points={entry.points}
                fallback={getAvatarFallback(entry.avatarKey, entry.displayName)}
                isCurrentUser={entry.userId === userId}
                detail="Jogo atual"
              />
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  )
}
