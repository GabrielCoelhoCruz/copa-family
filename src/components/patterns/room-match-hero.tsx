import Link from 'next/link'
import { CalendarClock, MapPin, Users } from 'lucide-react'

import type { RoomNextAction } from '@/features/rooms/room-next-action'
import { TeamVersusStrip } from '@/components/patterns/team-versus-strip'
import {
  formatFixtureKickoff,
  formatFixtureMeta,
  fixtureDisplayTitle,
} from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
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

function RoomMatchHero({
  title,
  status,
  predictionCount,
  memberCount,
  homeScore,
  awayScore,
  winner,
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

  return (
    <section
      aria-labelledby="match-hero-heading"
      className="cf-animate-in overflow-hidden rounded-2xl border border-brand-field/25 bg-gradient-to-br from-brand-field/12 via-card to-card shadow-md"
    >
      <div
        className="relative px-4 pb-4 pt-4"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, color-mix(in oklch, var(--brand-field), transparent 92%) 0, color-mix(in oklch, var(--brand-field), transparent 92%) 1px, transparent 1px, transparent 28px)',
        }}
      >
        <div className="relative flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jogo atual
            </p>
            {!fixture ? (
              <h2
                id="match-hero-heading"
                className="font-heading text-2xl font-black leading-tight tracking-tight"
              >
                {displayTitle}
              </h2>
            ) : null}
            {fixture && title !== displayTitle ? (
              <p className="text-xs text-muted-foreground">{title}</p>
            ) : null}
          </div>
          <MatchStatusBadge status={status} />
        </div>

        {fixture ? (
          <div className="mt-3">
            <h2 id="match-hero-heading" className="sr-only">
              {displayTitle}
            </h2>
            <TeamVersusStrip fixture={fixture} size="lg" />
          </div>
        ) : null}

        {kickoff ? (
          <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <CalendarClock className="size-3.5 shrink-0" aria-hidden />
            {kickoff}
          </p>
        ) : null}

        {meta ? (
          <p className="mt-1 flex items-start justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <span>{meta}</span>
          </p>
        ) : null}

        {showScore ? (
          <p className="mt-3 text-center font-heading text-3xl font-black tabular-nums tracking-tight sm:text-4xl">
            {homeScore}
            <span className="mx-2 text-2xl text-muted-foreground">×</span>
            {awayScore}
          </p>
        ) : null}

        {winner && status === 'finished' ? (
          <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
            Vencedor: <span className="text-foreground">{winner}</span>
          </p>
        ) : null}

        <ul className="mt-3 flex flex-wrap justify-center gap-3 text-xs font-medium text-muted-foreground">
          <li className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {memberCount} jogadores
          </li>
          <li className="flex items-center gap-1">
            <CalendarClock className="size-3.5" aria-hidden />
            {predictionCount} palpite(s)
          </li>
        </ul>
      </div>

      <div className="border-t border-border/70 bg-card/80 px-4 py-4">
        <p className="font-semibold text-foreground">{nextAction.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{nextAction.description}</p>
        {nextAction.ctaKind === 'anchor' ? (
          <a
            href={ctaHref}
            className={cn(
              buttonVariants({
                variant: nextAction.emphasis === 'party' ? 'party' : 'outline',
                size: 'lg',
              }),
              'cf-pressable mt-3 flex min-h-12 w-full items-center justify-center'
            )}
          >
            {nextAction.ctaLabel}
          </a>
        ) : (
          <Link
            href={ctaHref}
            className={cn(
              buttonVariants({
                variant:
                  nextAction.emphasis === 'party'
                    ? 'party'
                    : nextAction.emphasis === 'default'
                      ? 'default'
                      : 'outline',
                size: 'lg',
              }),
              'cf-pressable mt-3 flex min-h-12 w-full items-center justify-center'
            )}
          >
            {nextAction.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  )
}

export { RoomMatchHero }
