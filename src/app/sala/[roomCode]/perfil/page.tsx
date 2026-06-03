import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Medal, User } from 'lucide-react'

import { PageSection } from '@/components/layouts/page-section'
import { EmptyState } from '@/components/patterns/empty-state'
import { ParticipantRow } from '@/components/patterns/participant-row'
import { PointsBreakdownList } from '@/components/patterns/points-breakdown-list'
import { ShareScoreCard } from '@/components/patterns/share-score-card'
import {
  getRanking,
  getUserRoomProfile,
  getRoomContext,
  getUserWinnerStreakSummary,
} from '@/features/rooms/queries'
import { BADGE_DEFINITIONS, getEarnedBadgeIds } from '@/lib/badges'
import { getAvatarFallback } from '@/lib/avatars'
import { getInviteUrl } from '@/lib/invite-url'
import { buildPointsBreakdown, getLockedBadgesCount } from '@/lib/points-breakdown'
import { routes } from '@/lib/routes'
import { withRankingPositions } from '@/lib/ranking'
import { getGuestUserId } from '@/lib/session'
import { cn } from '@/lib/utils'

type PerfilPageProps = {
  params: Promise<{ roomCode: string }>
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { roomCode } = await params
  const context = await getRoomContext(roomCode)

  if (!context) {
    notFound()
  }

  const userId = await getGuestUserId()
  if (!userId) {
    return (
      <EmptyState
        icon={<User className="size-6" />}
        title="Perfil indisponível"
        description="Entre na sala pelo link de convite para ver seu perfil."
      />
    )
  }

  const profile = await getUserRoomProfile(context.room.id, userId)
  if (!profile) {
    notFound()
  }

  const earned = getEarnedBadgeIds(profile.sources)
  const breakdown = buildPointsBreakdown(profile.pointRows)
  const lockedBadges = getLockedBadgesCount(earned.size)
  const streak = await getUserWinnerStreakSummary(context.room.id, userId)
  const ranking = withRankingPositions(await getRanking(context.room.id))
  const myRanking = ranking.find((entry) => entry.userId === userId)
  const inviteUrl = await getInviteUrl(context.room.code)
  const predictionCount = profile.pointRows.filter(
    (row) => row.source === 'prediction_submitted'
  ).length
  const copaPareCount = profile.pointRows.filter(
    (row) => row.source === 'copa_pare_participation'
  ).length

  return (
    <>
      <ParticipantRow
        name={profile.displayName}
        fallback={getAvatarFallback(profile.avatarKey, profile.displayName)}
        role={profile.role}
        points={profile.points}
        isOnline
      />

      <ShareScoreCard
        displayName={profile.displayName}
        roomName={context.room.name}
        position={myRanking?.position ?? null}
        points={profile.points}
        predictionCount={predictionCount}
        copaPareCount={copaPareCount}
        inviteUrl={inviteUrl}
      />

      <PageSection
        title="Seus pontos"
        titleId="points-breakdown-heading"
        description={`Sequência atual: ${streak.current} · melhor: ${streak.best}.`}
      >
        <PointsBreakdownList rows={breakdown} className="mt-3" />
      </PageSection>

      <PageSection title="Medalhas" titleId="badges-heading">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Medal className="size-4 text-brand-trophy" aria-hidden />
          {lockedBadges > 0 ? (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
              Faltam {lockedBadges}
            </span>
          ) : (
            <span className="rounded-full bg-brand-trophy/15 px-2 py-0.5 text-xs font-semibold text-brand-trophy">
              Coleção completa
            </span>
          )}
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {BADGE_DEFINITIONS.map((badge) => {
            const isEarned = earned.has(badge.id)
            return (
              <li
                key={badge.id}
                className={cn(
                  'rounded-xl border px-3 py-2 text-sm transition-colors',
                  isEarned
                    ? 'border-brand-trophy/40 bg-brand-trophy/10'
                    : 'border-dashed border-border/60 bg-muted/20 opacity-75'
                )}
              >
                <p className="font-semibold">
                  {badge.label}
                  {isEarned ? (
                    <span className="ml-2 text-xs font-bold text-brand-trophy">
                      Desbloqueada
                    </span>
                  ) : null}
                </p>
                <p className="text-muted-foreground">{badge.description}</p>
              </li>
            )
          })}
        </ul>
      </PageSection>

      <Link
        href={routes.sala(context.room.code)}
        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Voltar ao jogo
      </Link>
    </>
  )
}
