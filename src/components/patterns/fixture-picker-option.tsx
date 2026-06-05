'use client'

import { TeamVersusStrip } from '@/components/patterns/team-versus-strip'
import { formatFixtureKickoff } from '@/features/fixtures/format'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { cn } from '@/lib/utils'

type FixturePickerOptionProps = {
  fixture: CatalogFixtureView
  inputId: string
  checked: boolean
  onSelect: (fixtureId: string) => void
  meta?: string | null
  /** Modal: same badges/strip, slightly tighter spacing so the dialog fits the viewport. */
  variant?: 'default' | 'modal'
}

function FixturePickerOption({
  fixture,
  inputId,
  checked,
  onSelect,
  meta,
  variant = 'default',
}: FixturePickerOptionProps) {
  const kickoff = formatFixtureKickoff(fixture.kickoff_at)
  const details = [kickoff, meta].filter(Boolean).join(' · ')
  const isModal = variant === 'modal'

  return (
    <label
      htmlFor={inputId}
      className={cn(
        'flex cursor-pointer rounded-lg border transition-colors',
        isModal ? 'gap-2 px-2.5 py-2' : 'gap-3 px-3 py-2.5',
        'hover:bg-brand-sky/10 has-[:checked]:border-brand-field/40 has-[:checked]:bg-brand-field/10',
        checked && 'border-brand-field/50 bg-brand-field/15 ring-1 ring-brand-field/30'
      )}
    >
      <input
        type="radio"
        id={inputId}
        checked={checked}
        onChange={() => onSelect(fixture.id)}
        className={cn(
          'size-4 shrink-0 accent-[var(--brand-field)]',
          isModal ? 'mt-2 self-start' : 'mt-3'
        )}
      />
      <span className="min-w-0 flex-1 space-y-0.5">
        <TeamVersusStrip
          fixture={fixture}
          size="sm"
          className={isModal ? 'gap-1.5' : 'gap-2'}
        />
        {details ? (
          <span
            className={cn(
              'block text-center text-muted-foreground',
              isModal ? 'line-clamp-2 text-[11px] leading-snug' : 'text-xs'
            )}
          >
            {details}
          </span>
        ) : null}
      </span>
    </label>
  )
}

export { FixturePickerOption }
