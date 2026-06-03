import { TeamBadge } from '@/components/patterns/team-badge'
import { fixtureDisplayTitle } from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { cn } from '@/lib/utils'

type TeamVersusStripProps = {
  fixture: CatalogFixtureView
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function TeamVersusStrip({ fixture, size = 'md', className }: TeamVersusStripProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-3 sm:gap-4', className)}
      aria-label={fixtureDisplayTitle(fixture)}
    >
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <TeamBadge
          name={fixture.home_team_name}
          badgeUrl={fixture.home_team_badge_url ?? fixture.home_team_logo}
          size={size}
        />
        <span className="line-clamp-2 text-xs font-semibold leading-tight sm:text-sm">
          {fixture.home_team_name}
        </span>
      </div>
      <span
        className="shrink-0 font-heading text-lg font-black text-muted-foreground sm:text-xl"
        aria-hidden
      >
        ×
      </span>
      <div className="flex min-w-0 flex-1 flex-col items-center gap-1 text-center">
        <TeamBadge
          name={fixture.away_team_name}
          badgeUrl={fixture.away_team_badge_url ?? fixture.away_team_logo}
          size={size}
        />
        <span className="line-clamp-2 text-xs font-semibold leading-tight sm:text-sm">
          {fixture.away_team_name}
        </span>
      </div>
    </div>
  )
}

export { TeamVersusStrip }
