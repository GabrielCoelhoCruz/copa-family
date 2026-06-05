import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import { StadiumCard } from '@/components/patterns/stadium-card'
import { StadiumFlag } from '@/components/patterns/stadium-flag'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import {
  formatFixtureKickoff,
  formatFixtureMeta,
} from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { routes } from '@/lib/routes'

type FixtureRowProps = {
  fixture: CatalogFixtureView
  showCreateRoomCta?: boolean
  dateLabel?: string
}

function FixtureRow({
  fixture,
  showCreateRoomCta = true,
  dateLabel,
}: FixtureRowProps) {
  const kickoff = formatFixtureKickoff(fixture.kickoff_at)
  const time = kickoff?.split('·').pop()?.trim() ?? kickoff ?? '—'
  const meta = formatFixtureMeta(fixture)
  const group =
    fixture.round ?? fixture.stage ?? fixture.group_name ?? meta?.split('·')[0] ?? ''

  const homeName = fixture.home_team_name
  const awayName = fixture.away_team_name

  const inner = (
    <div className="flex items-center gap-3">
      <div className="flex w-[46px] shrink-0 flex-col items-center">
        <span className="font-heading text-[15px] font-extrabold text-[var(--cf-gold)] tabular-nums">
          {time}
        </span>
        {group ? (
          <span className="text-[10.5px] font-bold uppercase tracking-wide text-[var(--cf-faint)]">
            {group}
          </span>
        ) : null}
      </div>
      <div className="h-[34px] w-px shrink-0 bg-[var(--cf-card-border-soft)]" />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <StadiumFlag teamName={fixture.home_team_name} size={26} round />
        <span className="truncate text-sm font-bold">{homeName}</span>
        <span className="text-xs text-[var(--cf-faint)]">×</span>
        <span className="truncate text-sm font-bold">{awayName}</span>
        <StadiumFlag teamName={fixture.away_team_name} size={26} round />
      </div>
      {showCreateRoomCta ? (
        <ChevronRight className="size-[18px] shrink-0 text-[var(--cf-faint)]" aria-hidden />
      ) : null}
    </div>
  )

  if (!showCreateRoomCta) {
    return (
      <StadiumCard glass pad={13}>
        {inner}
      </StadiumCard>
    )
  }

  return (
    <Link href={routes.criarSalaComFixture(fixture.id)} className="block">
      <StadiumCard glass pad={13} className="transition-opacity hover:opacity-95">
        {inner}
      </StadiumCard>
    </Link>
  )
}

function FixtureDayGroup({
  label,
  fixtures,
  showCreateRoomCta,
}: {
  label: string
  fixtures: CatalogFixtureView[]
  showCreateRoomCta?: boolean
}) {
  return (
    <div className="mb-4">
      <StadiumLabel>{label}</StadiumLabel>
      <div className="flex flex-col gap-2">
        {fixtures.map((fixture) => (
          <FixtureRow
            key={fixture.id}
            fixture={fixture}
            showCreateRoomCta={showCreateRoomCta}
          />
        ))}
      </div>
    </div>
  )
}

export { FixtureRow, FixtureDayGroup }
