'use client'

import { Check, Clock } from 'lucide-react'

import { StadiumFlag } from '@/components/patterns/stadium-flag'
import { formatFixtureKickoff } from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { cn } from '@/lib/utils'

type FixturePickerCompactProps = {
  fixtures: CatalogFixtureView[]
  selectedId: string
  onSelect: (fixtureId: string) => void
  name?: string
}

function formatDayLabel(fixture: CatalogFixtureView): string {
  if (!fixture.kickoff_at) return '—'
  const kickoff = new Date(fixture.kickoff_at)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const day = new Date(kickoff.getFullYear(), kickoff.getMonth(), kickoff.getDate())
  const diff = Math.round((day.getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Amanhã'
  return kickoff.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

function FixturePickerCompact({
  fixtures,
  selectedId,
  onSelect,
  name = 'fixtureId',
}: FixturePickerCompactProps) {
  return (
    <div className="flex flex-col gap-2">
      {fixtures.map((fixture) => {
        const on = selectedId === fixture.id
        const kickoff = formatFixtureKickoff(fixture.kickoff_at)
        const time = kickoff?.split('·').pop()?.trim() ?? kickoff ?? '—'
        const day = formatDayLabel(fixture)

        return (
          <label
            key={fixture.id}
            className={cn(
              'flex cursor-pointer items-center gap-3.5 rounded-[15px] border-[1.5px] px-3.5 py-3 text-left font-heading transition-colors',
              on
                ? 'border-[var(--cf-gold)] bg-[rgba(230,197,119,0.13)]'
                : 'border-[var(--cf-card-border)] bg-[var(--cf-glass)]'
            )}
          >
            <input
              type="radio"
              name={name}
              value={fixture.id}
              checked={on}
              onChange={() => onSelect(fixture.id)}
              className="sr-only"
            />
            <div className="flex items-center">
              <StadiumFlag teamName={fixture.home_team_name} size={34} round />
              <div className="-ml-2.5">
                <StadiumFlag
                  teamName={fixture.away_team_name}
                  size={34}
                  round
                  ring={on ? 'var(--cf-gold)' : 'var(--cf-hero)'}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="text-[15.5px] font-extrabold text-white">{day}</span>
              <span className="inline-flex items-center gap-1 text-sm font-extrabold text-[var(--cf-gold)] tabular-nums">
                <Clock className="size-3.5" aria-hidden />
                {time}
              </span>
            </div>
            <div
              className={cn(
                'flex size-[22px] shrink-0 items-center justify-center rounded-full border-2',
                on
                  ? 'border-[var(--cf-gold)] bg-[var(--cf-gold)]'
                  : 'border-[var(--cf-faint)] bg-transparent'
              )}
              aria-hidden
            >
              {on ? <Check className="size-3 text-[var(--cf-ink)]" strokeWidth={3} /> : null}
            </div>
          </label>
        )
      })}
    </div>
  )
}

export { FixturePickerCompact }
