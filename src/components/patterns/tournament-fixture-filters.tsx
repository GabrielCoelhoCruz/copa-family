'use client'

import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { TournamentPhaseId } from '@/features/fixtures/tournament-schedule'
import { cn } from '@/lib/utils'

type TournamentPhaseOption = {
  id: TournamentPhaseId
  label: string
  count: number
}

type GroupFilterOption = {
  key: string
  label: string
}

type TournamentFixtureFiltersProps = {
  phases: TournamentPhaseOption[]
  groupOptions: GroupFilterOption[]
  phaseId: TournamentPhaseId | null
  groupKey: string | null
  onPhaseChange: (phaseId: TournamentPhaseId) => void
  onGroupChange: (groupKey: string | null) => void
  className?: string
  compact?: boolean
}

function TournamentFixtureFilters({
  phases,
  groupOptions,
  phaseId,
  groupKey,
  onPhaseChange,
  onGroupChange,
  className,
  compact = false,
}: TournamentFixtureFiltersProps) {
  const activePhase = phaseId ?? phases[0]?.id

  if (phases.length === 0) return null

  return (
    <div className={cn(compact ? 'space-y-2' : 'space-y-3', className)}>
      <Tabs
        value={activePhase ?? undefined}
        onValueChange={(value) => {
          onPhaseChange(value as TournamentPhaseId)
          onGroupChange(null)
        }}
      >
        <TabsList
          variant="line"
          className="h-auto w-full max-w-full justify-start gap-1 overflow-x-auto cf-scrollbar-hidden"
        >
          {phases.map((phase) => (
            <TabsTrigger
              key={phase.id}
              value={phase.id}
              className={cn('shrink-0', compact ? 'min-h-8 px-2.5 text-xs' : 'min-h-10 px-3')}
            >
              {phase.label}
              <Badge variant="secondary" className="tabular-nums">
                {phase.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {activePhase === 'grupos' && groupOptions.length > 0 ? (
        <div className={cn(compact ? 'space-y-1' : 'space-y-2')}>
          <p
            className={cn(
              'font-semibold uppercase tracking-wide text-muted-foreground',
              compact ? 'text-[10px]' : 'text-xs'
            )}
          >
            Filtrar por grupo
          </p>
          <ul className="flex flex-wrap gap-1.5">
            <li>
              <button
                type="button"
                onClick={() => onGroupChange(null)}
                className={cn(
                  'cf-pressable rounded-full border font-semibold',
                  compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
                  groupKey === null
                    ? 'border-brand-field/50 bg-brand-field/15 text-foreground'
                    : 'border-border/80 bg-card/80 text-muted-foreground'
                )}
              >
                Todos
              </button>
            </li>
            {groupOptions.map((option) => (
              <li key={option.key}>
                <button
                  type="button"
                  onClick={() => onGroupChange(option.key)}
                  className={cn(
                    'cf-pressable rounded-full border font-semibold',
                    compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
                    groupKey === option.key
                      ? 'border-brand-field/50 bg-brand-field/15 text-foreground'
                      : 'border-border/80 bg-card/80 text-muted-foreground'
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

export { TournamentFixtureFilters }
export type { GroupFilterOption, TournamentPhaseOption }
