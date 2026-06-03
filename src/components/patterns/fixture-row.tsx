import Link from 'next/link'

import { TeamVersusStrip } from '@/components/patterns/team-versus-strip'
import {
  formatFixtureKickoff,
  formatFixtureMeta,
} from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { routes } from '@/lib/routes'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type FixtureRowProps = {
  fixture: CatalogFixtureView
  showCreateRoomCta?: boolean
}

function FixtureRow({ fixture, showCreateRoomCta = true }: FixtureRowProps) {
  const kickoff = formatFixtureKickoff(fixture.kickoff_at)
  const meta = formatFixtureMeta(fixture)
  const hasScore =
    fixture.home_goals != null && fixture.away_goals != null
  const stageLabel = [fixture.group_name, fixture.round, fixture.stage]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="rounded-xl border border-border/70 bg-card/80 px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        {stageLabel ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {stageLabel}
          </p>
        ) : (
          <span />
        )}
        {fixture.status_short ? (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
            {fixture.status_short}
          </span>
        ) : null}
      </div>

      <div className="mt-2">
        <TeamVersusStrip fixture={fixture} size="sm" />
      </div>

      {hasScore ? (
        <p className="mt-2 text-center font-heading text-xl font-black tabular-nums">
          {fixture.home_goals}
          <span className="mx-1.5 text-muted-foreground">×</span>
          {fixture.away_goals}
        </p>
      ) : null}

      <p className="mt-2 text-center text-sm text-muted-foreground">
        {kickoff ?? 'Horário a confirmar'}
      </p>
      <p className="mt-0.5 text-center text-xs text-muted-foreground">
        {meta ?? 'Sede a confirmar'}
      </p>

      {showCreateRoomCta ? (
        <Link
          href={routes.criarSalaComFixture(fixture.id)}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'cf-pressable mt-3 flex min-h-10 w-full items-center justify-center'
          )}
        >
          Criar nova sala
        </Link>
      ) : null}
    </article>
  )
}

export { FixtureRow }
