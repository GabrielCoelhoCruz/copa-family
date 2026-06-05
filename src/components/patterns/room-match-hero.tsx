import Link from 'next/link'
import { Target, Zap } from 'lucide-react'

import type { RoomNextAction } from '@/features/rooms/room-next-action'
import {
  formatFixtureKickoff,
  formatFixtureMeta,
  fixtureDisplayTitle,
} from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import { StadiumCard } from '@/components/patterns/stadium-card'
import { StadiumFlag } from '@/components/patterns/stadium-flag'
import { buttonVariants } from '@/components/ui/button'
import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type RoomMatchHeroProps = {
  title: string
  status: MatchStatus
  predictionCount: number
  memberCount: number
  homeScore: number | null
  awayScore: number | null
  winner: string | null
  nextAction: RoomNextAction
  fixture?: CatalogFixtureView | null
}

function PitchOverlay() {
  return (
    <svg
      viewBox="0 0 360 120"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 size-full opacity-50"
      aria-hidden
    >
      <g fill="none" stroke="rgba(230,197,119,0.4)" strokeWidth="1.2">
        <rect x="6" y="6" width="348" height="108" rx="4" />
        <line x1="180" y1="6" x2="180" y2="114" />
        <circle cx="180" cy="60" r="24" />
      </g>
    </svg>
  )
}

function TeamMatchColumn({
  teamName,
  score,
  showScore,
}: {
  teamName: string
  score: number | null
  showScore: boolean
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-2 px-0.5">
      <div className="flex size-12 shrink-0 items-center justify-center">
        <StadiumFlag teamName={teamName} size={48} round />
      </div>
      {showScore && score != null ? (
        <div className="font-heading text-[40px] font-black leading-none text-white drop-shadow-md">
          {score}
        </div>
      ) : null}
      <p className="w-full text-center text-xs font-bold leading-snug text-pretty">
        {teamName}
      </p>
    </div>
  )
}

function CenterMatchColumn({
  showScore,
  kickoffLabel,
}: {
  showScore: boolean
  kickoffLabel: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 self-center px-0.5">
      {showScore ? (
        <div className="flex size-[50px] items-center justify-center font-heading text-lg font-black text-[var(--cf-faint)]">
          ×
        </div>
      ) : (
        <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full border border-[rgba(230,197,119,0.5)] bg-[radial-gradient(circle,rgba(230,197,119,0.3),rgba(230,197,119,0.05))] font-heading text-lg font-black text-[var(--cf-gold)]">
          VS
        </div>
      )}
      <p className="max-w-full text-center text-[10.5px] leading-tight font-bold text-white/80 text-balance">
        {kickoffLabel}
      </p>
    </div>
  )
}

function RoomMatchHero({
  title,
  status,
  homeScore,
  awayScore,
  nextAction,
  fixture = null,
}: RoomMatchHeroProps) {
  const hasScore = homeScore != null && awayScore != null
  const showScore =
    hasScore && (status === 'live' || status === 'halftime' || status === 'finished')
  const displayTitle = fixture ? fixtureDisplayTitle(fixture) : title
  const kickoff = fixture ? formatFixtureKickoff(fixture.kickoff_at) : null
  const meta = fixture ? formatFixtureMeta(fixture) : null
  const ctaHref =
    nextAction.ctaKind === 'anchor' && nextAction.anchorTargetId
      ? `#${nextAction.anchorTargetId}`
      : nextAction.href

  const ctaVariant =
    nextAction.emphasis === 'party'
      ? 'stadium-coral'
      : nextAction.emphasis === 'default'
        ? 'stadium'
        : 'stadium-ghost'

  const CtaIcon =
    status === 'halftime' ? Zap : status === 'predictions_open' ? Target : undefined

  return (
    <StadiumCard solid glow pad={0} className="overflow-hidden">
      <div
        className="relative px-4 pb-3.5 pt-4"
        style={{
          background:
            'repeating-linear-gradient(90deg,#2c4322 0 28px,#28401f 28px 56px)',
        }}
      >
        <PitchOverlay />
        <div className="relative">
          <div className="mb-3 flex justify-center">
            <MatchStatusBadge status={status} variant="stadium" />
          </div>

          {fixture ? (
            <div className="grid grid-cols-3 items-start gap-1">
              <TeamMatchColumn
                teamName={fixture.home_team_name}
                score={homeScore}
                showScore={showScore}
              />
              <CenterMatchColumn
                showScore={showScore}
                kickoffLabel={
                  status === 'finished' ? 'Final' : kickoff ?? displayTitle
                }
              />
              <TeamMatchColumn
                teamName={fixture.away_team_name}
                score={awayScore}
                showScore={showScore}
              />
            </div>
          ) : (
            <h2 className="text-center font-heading text-xl font-black">{displayTitle}</h2>
          )}

          {meta ? (
            <p className="mt-2.5 flex w-full items-center justify-center gap-1.5 text-[11px] text-white/60">
              <Target className="size-3 shrink-0 opacity-50" aria-hidden />
              {meta}
            </p>
          ) : null}
        </div>
      </div>

      <div className="px-3.5 py-3.5">
        {nextAction.ctaKind === 'anchor' ? (
          <a
            href={ctaHref}
            className={cn(buttonVariants({ variant: ctaVariant }), 'cf-pressable w-full')}
          >
            {CtaIcon ? <CtaIcon className="size-[19px]" aria-hidden /> : null}
            {nextAction.ctaLabel}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className={cn(buttonVariants({ variant: ctaVariant }), 'cf-pressable w-full')}
          >
            {CtaIcon ? <CtaIcon className="size-[19px]" aria-hidden /> : null}
            {nextAction.ctaLabel}
          </Link>
        )}
      </div>
    </StadiumCard>
  )
}

export { RoomMatchHero }
