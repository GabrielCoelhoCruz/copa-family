import { Crown } from 'lucide-react'
import { notFound } from 'next/navigation'

import { EmptyState } from '@/components/patterns/empty-state'
import { RankRow } from '@/components/patterns/rank-row'
import { getRanking, getRoomContext } from '@/features/rooms/queries'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { getAvatarFallback } from '@/lib/avatars'
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

  const ranking = await getRanking(context.room.id)

  if (ranking.length === 0) {
    return (
      <EmptyState
        icon={<Crown className="size-6" />}
        title="Ranking vazio"
        description="Quando alguém enviar um palpite, os pontos aparecem aqui."
      />
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-sm text-muted-foreground">
        +10 por palpite · vencedor +50 · craque +50 · placar exato +100 · Copa Pare
        +100.
      </p>
      <ul className="flex flex-col gap-2">
        {ranking.map((entry, index) => {
          const prev = ranking[index - 1]
          let position = index + 1
          if (index > 0 && prev && entry.points === prev.points) {
            let tiePosition = index
            while (
              tiePosition > 0 &&
              ranking[tiePosition - 1]?.points === entry.points
            ) {
              tiePosition -= 1
            }
            position = tiePosition + 1
          }
          return (
            <li key={entry.userId}>
              <RankRow
                position={position}
                name={entry.displayName}
                points={entry.points}
                fallback={getAvatarFallback(entry.avatarKey, entry.displayName)}
                isCurrentUser={entry.userId === userId}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
