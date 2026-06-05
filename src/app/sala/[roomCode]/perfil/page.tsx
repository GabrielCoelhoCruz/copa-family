import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Medal, User } from 'lucide-react'

import { PageSection } from '@/components/layouts/page-section'
import { EmptyState } from '@/components/patterns/empty-state'
import { PointsBreakdownList } from '@/components/patterns/points-breakdown-list'
import { ShareScoreCard } from '@/components/patterns/share-score-card'
import { StadiumAvatar } from '@/components/patterns/stadium-avatar'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import { avatarColorForName } from '@/lib/avatar-colors'
import {
  getRanking,
  getUserRoomProfile,
  getRoomContext,
  getUserWinnerStreakSummary,
} from '@/features/rooms/queries'
import { BADGE_DEFINITIONS, getEarnedBadgeIds } from '@/lib/badges'
import { resolveUserAvatar } from '@/lib/user-avatar'
import { getInviteUrl } from '@/lib/invite-url'
import { buildPointsBreakdown } from '@/lib/points-breakdown'
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
      <div className="flex items-center gap-3.5">
        <StadiumAvatar
          initial={profile.displayName.slice(0, 1)}
          color={avatarColorForName(profile.displayName)}
          photoUrl={profile.avatarPhotoUrl}
          size={64}
          ring="var(--cf-gold)"
        />
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[21px] font-extrabold">{profile.displayName}</div>
          <div className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-[rgba(230,197,119,0.13)] px-2.5 py-1 text-xs font-bold text-[var(--cf-gold)]">
            {profile.role === 'owner' ? 'Organizador' : 'Participante'}
          </div>
        </div>
      </div>

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

      <StadiumLabel>
        Medalhas · {earned.size}/{BADGE_DEFINITIONS.length}
      </StadiumLabel>
      <ul className="grid grid-cols-3 gap-2.5">
        {BADGE_DEFINITIONS.map((badge) => {
          const isEarned = earned.has(badge.id)
          return (
            <li
              key={badge.id}
              className={cn(
                'rounded-2xl border px-1.5 py-3.5 text-center',
                isEarned
                  ? 'border-[rgba(230,197,119,0.35)] bg-[rgba(230,197,119,0.1)]'
                  : 'border-[var(--cf-card-border-soft)] bg-white/[0.03] opacity-50'
              )}
            >
              <div
                className={cn(
                  'mx-auto mb-2 flex size-11 items-center justify-center rounded-full',
                  isEarned ? 'cf-bg-gold-gradient' : 'bg-white/[0.06]'
                )}
              >
                <Medal
                  className={cn('size-5', isEarned ? 'text-[var(--cf-ink)]' : 'text-[var(--cf-faint)]')}
                  aria-hidden
                />
              </div>
              <p className="text-[11px] font-bold leading-tight text-white">{badge.label}</p>
            </li>
          )
        })}
      </ul>

      <Link
        href={routes.sala(context.room.code)}
        className="text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Voltar ao jogo
      </Link>
    </>
  )
}
