'use client'

import { useMemo, useState } from 'react'

import { FixturePickerModal } from '@/components/patterns/fixture-picker-modal'
import { FixturePickerOption } from '@/components/patterns/fixture-picker-option'
import { TeamVersusStrip } from '@/components/patterns/team-versus-strip'
import { Button } from '@/components/ui/button'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { formatFixtureKickoff, formatFixtureMeta } from '@/features/fixtures/format'
import {
  findFixtureById,
  getFixturesForDateKey,
  getTodayDateKeyForPicker,
  sortFixturesByKickoff,
} from '@/features/fixtures/fixture-picker-utils'
type FixturePickerProps = {
  fixtures: CatalogFixtureView[]
  name?: string
  defaultValue?: string
  errorMessage?: string
  describedBy?: string
  /** Host "próximo jogo": default browse day favors upcoming kickoffs. */
  preferUpcoming?: boolean
}

function FixturePicker({
  fixtures,
  name = 'fixtureId',
  defaultValue,
  errorMessage,
  describedBy,
  preferUpcoming = false,
}: FixturePickerProps) {
  const todayKey = getTodayDateKeyForPicker()
  const [selectedId, setSelectedId] = useState<string | null>(defaultValue ?? null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalSession, setModalSession] = useState(0)

  function openFixtureModal() {
    setModalSession((value) => value + 1)
    setModalOpen(true)
  }

  const todayFixtures = useMemo(
    () => sortFixturesByKickoff(getFixturesForDateKey(fixtures, todayKey)),
    [fixtures, todayKey]
  )

  const selectedFixture = findFixtureById(fixtures, selectedId ?? undefined)
  const selectedOnToday =
    selectedFixture != null &&
    todayFixtures.some((fixture) => fixture.id === selectedFixture.id)
  const showSelectedCard = selectedFixture != null && !selectedOnToday

  if (fixtures.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
        Nenhum jogo sincronizado ainda. A sala usará o título padrão &quot;Partida da
        Copa&quot;.
      </p>
    )
  }

  return (
    <fieldset className="space-y-3">
      <legend className="sr-only">Escolha o jogo da Copa</legend>
      <input type="hidden" name={name} value={selectedId ?? ''} />

      {showSelectedCard && selectedFixture ? (
        <div className="rounded-xl border border-brand-field/40 bg-brand-field/10 px-3 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Jogo selecionado
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 shrink-0 px-2 text-xs"
              onClick={openFixtureModal}
            >
              Trocar
            </Button>
          </div>
          <div className="mt-2">
            <TeamVersusStrip fixture={selectedFixture} size="sm" />
          </div>
          {formatFixtureKickoff(selectedFixture.kickoff_at) ? (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {formatFixtureKickoff(selectedFixture.kickoff_at)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Hoje
        </p>
        {todayFixtures.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm text-muted-foreground">
            Nenhum jogo hoje. Escolha outro dia no calendário da Copa.
          </p>
        ) : (
          <div
            className="space-y-2"
            role="radiogroup"
            aria-label="Jogos de hoje"
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={describedBy}
          >
            {todayFixtures.map((fixture) => (
              <FixturePickerOption
                key={fixture.id}
                fixture={fixture}
                inputId={`fixture-today-${fixture.id}`}
                checked={selectedId === fixture.id}
                onSelect={setSelectedId}
                meta={formatFixtureMeta(fixture)}
              />
            ))}
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full min-h-11"
        onClick={openFixtureModal}
      >
        {todayFixtures.length === 0 ? 'Escolher outro dia' : 'Ver todos os jogos'}
      </Button>

      <FieldErrorInline message={errorMessage} />

      <FixturePickerModal
        key={modalSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
        fixtures={fixtures}
        selectedId={selectedId}
        onSelect={setSelectedId}
        preferUpcoming={preferUpcoming}
      />
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
