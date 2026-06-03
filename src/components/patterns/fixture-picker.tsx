'use client'

import { TeamBadge } from '@/components/patterns/team-badge'
import { formatFixtureKickoff, fixtureDisplayTitle } from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { cn } from '@/lib/utils'

type FixturePickerProps = {
  fixtures: CatalogFixtureView[]
  name?: string
  defaultValue?: string
  errorMessage?: string
  describedBy?: string
}

function FixturePicker({
  fixtures,
  name = 'fixtureId',
  defaultValue,
  errorMessage,
  describedBy,
}: FixturePickerProps) {
  if (fixtures.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        Nenhum jogo sincronizado ainda. A sala usará o título padrão &quot;Partida da
        Copa&quot;.
      </p>
    )
  }

  return (
    <fieldset className="space-y-2">
      <legend className="sr-only">Escolha o jogo da Copa</legend>
      <div
        className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border/80 p-2"
        role="radiogroup"
        aria-invalid={errorMessage ? true : undefined}
        aria-describedby={describedBy}
      >
        {fixtures.map((fixture) => {
          const kickoff = formatFixtureKickoff(fixture.kickoff_at)
          const meta = [fixture.group_name, fixture.round, fixture.stage]
            .filter(Boolean)
            .join(' · ')
          const id = `fixture-${fixture.id}`
          const isSelected = defaultValue === fixture.id

          return (
            <label
              key={fixture.id}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer gap-3 rounded-lg border px-3 py-2.5 transition-colors',
                'hover:bg-brand-sky/10 has-[:checked]:border-brand-field/40 has-[:checked]:bg-brand-field/10',
                isSelected && 'border-brand-field/50 bg-brand-field/15 ring-1 ring-brand-field/30'
              )}
            >
              <input
                type="radio"
                id={id}
                name={name}
                value={fixture.id}
                defaultChecked={isSelected}
                className="mt-2 size-4 shrink-0 accent-[var(--brand-field)]"
                required
              />
              <span className="flex min-w-0 flex-1 items-center gap-3">
                <span className="flex shrink-0 flex-col items-center gap-1">
                  <TeamBadge
                    name={fixture.home_team_name}
                    badgeUrl={fixture.home_team_badge_url ?? fixture.home_team_logo}
                    size="sm"
                  />
                  <TeamBadge
                    name={fixture.away_team_name}
                    badgeUrl={fixture.away_team_badge_url ?? fixture.away_team_logo}
                    size="sm"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-foreground">
                    {fixtureDisplayTitle(fixture)}
                  </span>
                  {kickoff ? (
                    <span className="block text-xs text-muted-foreground">{kickoff}</span>
                  ) : null}
                  {meta ? (
                    <span className="block text-xs text-muted-foreground">{meta}</span>
                  ) : null}
                </span>
              </span>
            </label>
          )
        })}
      </div>
      <FieldErrorInline message={errorMessage} />
    </fieldset>
  )
}

function FieldErrorInline({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-sm font-medium text-destructive" role="alert">
      {message}
    </p>
  )
}

export { FixturePicker }
