'use client'

import { useMemo, useState } from 'react'

import { FixturePickerOption } from '@/components/patterns/fixture-picker-option'
import { TournamentFixtureFilters } from '@/components/patterns/tournament-fixture-filters'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { formatFixtureMeta } from '@/features/fixtures/format'
import {
  buildFixtureDateGroups,
  findFixtureById,
  getFixturesForDateKey,
  getTodayDateKeyForPicker,
  pickDefaultBrowseDateKey,
  pickDefaultBrowsePhase,
  sortFixturesByKickoff,
} from '@/features/fixtures/fixture-picker-utils'
import {
  filterFixturesForTournamentTable,
  listGroupFilterOptions,
  listTournamentPhasesWithFixtures,
  type TournamentPhaseId,
} from '@/features/fixtures/tournament-schedule'
import { cn } from '@/lib/utils'

type FixturePickerModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fixtures: CatalogFixtureView[]
  selectedId: string | null
  onSelect: (fixtureId: string) => void
  preferUpcoming?: boolean
}

function FixturePickerModal({
  open,
  onOpenChange,
  fixtures,
  selectedId,
  onSelect,
  preferUpcoming = false,
}: FixturePickerModalProps) {
  const todayKey = getTodayDateKeyForPicker()
  const selectedFixture = findFixtureById(fixtures, selectedId ?? undefined)

  const dateGroups = useMemo(
    () => buildFixtureDateGroups(fixtures, { preferUpcoming }),
    [fixtures, preferUpcoming]
  )

  const defaultDateKey = useMemo(
    () =>
      pickDefaultBrowseDateKey(dateGroups, {
        todayKey,
        selectedFixture,
        preferUpcoming,
      }),
    [dateGroups, todayKey, selectedFixture, preferUpcoming]
  )

  const [browseDateKey, setBrowseDateKey] = useState<string | null>(defaultDateKey)
  const [phaseId, setPhaseId] = useState<TournamentPhaseId | null>(() =>
    defaultDateKey ? pickDefaultBrowsePhase(fixtures, defaultDateKey) : null
  )
  const [groupKey, setGroupKey] = useState<string | null>(null)

  const dayFixtures = useMemo(() => {
    if (!browseDateKey) return []
    return sortFixturesByKickoff(getFixturesForDateKey(fixtures, browseDateKey))
  }, [fixtures, browseDateKey])

  const phases = useMemo(
    () => listTournamentPhasesWithFixtures(dayFixtures),
    [dayFixtures]
  )
  const groupOptions = useMemo(() => listGroupFilterOptions(dayFixtures), [dayFixtures])
  const activePhase = phaseId ?? pickDefaultBrowsePhase(dayFixtures, browseDateKey ?? '') ?? phases[0]?.id

  const visibleFixtures = useMemo(() => {
    if (!activePhase || !browseDateKey) return []
    return filterFixturesForTournamentTable(dayFixtures, activePhase, groupKey)
  }, [activePhase, browseDateKey, dayFixtures, groupKey])

  function handleSelect(fixtureId: string) {
    onSelect(fixtureId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex flex-col gap-2 overflow-hidden p-2.5',
          'left-1/2 w-[calc(min(100vw,28rem)-2*var(--site-page-px))] max-w-[calc(min(100vw,28rem)-2*var(--site-page-px))]',
          'top-[max(0.5rem,3dvh)] max-h-[min(calc(100dvh-3.5rem),32rem)] translate-y-0',
          'sm:top-1/2 sm:max-h-[min(calc(100dvh-3rem),32rem)] sm:-translate-y-1/2'
        )}
        showCloseButton
      >
        <DialogHeader className="shrink-0 gap-0.5">
          <DialogTitle className="text-base leading-tight">Escolher jogo</DialogTitle>
          <DialogDescription className="line-clamp-2 text-xs leading-snug">
            Filtre por dia, fase e grupo para achar a partida da Copa.
          </DialogDescription>
        </DialogHeader>

        {dateGroups.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum jogo disponível com os filtros atuais.
          </p>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-2">
            <div className="shrink-0 space-y-1">
              <Label htmlFor="fixture-picker-day" className="text-xs">
                Dia
              </Label>
              <select
                id="fixture-picker-day"
                value={browseDateKey ?? ''}
                onChange={(event) => {
                  const nextKey = event.target.value
                  setBrowseDateKey(nextKey)
                  setPhaseId(pickDefaultBrowsePhase(fixtures, nextKey))
                  setGroupKey(null)
                }}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
              >
                {dateGroups.map((group) => (
                  <option key={group.dateKey} value={group.dateKey}>
                    {group.shortLabel} ({group.fixtures.length}{' '}
                    {group.fixtures.length === 1 ? 'jogo' : 'jogos'})
                  </option>
                ))}
              </select>
            </div>

            <TournamentFixtureFilters
              compact
              phases={phases}
              groupOptions={groupOptions}
              phaseId={activePhase ?? null}
              groupKey={groupKey}
              onPhaseChange={(value) => {
                setPhaseId(value)
                setGroupKey(null)
              }}
              onGroupChange={setGroupKey}
            />

            <div
              className="min-h-[14rem] flex-1 space-y-1.5 overflow-y-auto cf-scrollbar-hidden"
              role="radiogroup"
              aria-label="Jogos filtrados"
            >
              {visibleFixtures.length === 0 ? (
                <p className="rounded-lg border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
                  Nenhum jogo neste filtro.
                </p>
              ) : (
                visibleFixtures.map((fixture) => (
                  <FixturePickerOption
                    key={fixture.id}
                    variant="modal"
                    fixture={fixture}
                    inputId={`fixture-modal-${fixture.id}`}
                    checked={selectedId === fixture.id}
                    onSelect={handleSelect}
                    meta={formatFixtureMeta(fixture)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { FixturePickerModal }
