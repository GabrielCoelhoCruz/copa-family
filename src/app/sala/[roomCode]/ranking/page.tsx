import { Crown } from 'lucide-react'
import { notFound } from 'next/navigation'

import { EmptyState } from '@/components/patterns/empty-state'
import {
  RankingTabsView,
  type RankingEntry,
} from '@/components/patterns/ranking-tabs-view'
import { getMatchRanking, getRanking, getRoomContext } from '@/features/rooms/queries'
import { ANALYTICS_EVENTS, trackEvent } from '@/lib/analytics'
import { avatarColorForName } from '@/lib/avatar-colors'
import { withRankingPositions } from '@/lib/ranking'
import { getGuestUserId } from '@/lib/session'

type RankingPageProps = {
  params: Promise<{ roomCode: string }>
}

function toRankingEntry(
  entry: {
    userId: string
    displayName: string
    points: number
    position: number
    avatarPhotoUrl: string | null
  },
  userId: string | null,
  detail?: string
): RankingEntry {
  return {
    userId: entry.userId,
    displayName: entry.displayName,
    points: entry.points,
    position: entry.position,
    detail,
    avatarInitial: entry.displayName.slice(0, 1).toUpperCase(),
    avatarColor: avatarColorForName(entry.displayName),
    avatarPhotoUrl: entry.avatarPhotoUrl,
    isCurrentUser: entry.userId === userId,
  }
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

  if (accumulatedRanking.length === 0) {
    return (
      <EmptyState
        icon={<Crown className="size-6" />}
        title="Ranking vazio"
        description="Assim que a família começar a palpitar, o ranking aparece aqui."
      />
    )
  }

  const roomEntries = accumulatedRanking.map((entry) =>
    toRankingEntry(entry, userId, 'Acumulado na sala')
  )
  const matchEntries = currentMatchRanking.map((entry) =>
    toRankingEntry(entry, userId, 'Neste jogo')
  )

  return (
    <RankingTabsView
      roomRanking={roomEntries}
      matchRanking={matchEntries}
      matchFinished={context.match.status === 'finished'}
      currentUserId={userId}
    />
  )
}
