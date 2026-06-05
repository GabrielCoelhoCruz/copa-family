'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import { TeamBadge } from '@/components/patterns/team-badge'
import { TournamentFixtureFilters } from '@/components/patterns/tournament-fixture-filters'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { formatFixtureKickoff, fixtureDisplayTitle } from '@/features/fixtures/format'
import {
  filterFixturesForTournamentTable,
  listGroupFilterOptions,
  listTournamentPhasesWithFixtures,
  pickDefaultTournamentPhase,
  resolveFixtureGroupLabel,
  type TournamentPhaseId,
} from '@/features/fixtures/tournament-schedule'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type WorldCupScheduleTableProps = {
  fixtures: CatalogFixtureView[]
  showCreateRoomCta?: boolean
}

function WorldCupScheduleTable({
  fixtures,
  showCreateRoomCta = true,
}: WorldCupScheduleTableProps) {
  const phases = useMemo(() => listTournamentPhasesWithFixtures(fixtures), [fixtures])
  const groupOptions = useMemo(() => listGroupFilterOptions(fixtures), [fixtures])
  const defaultPhase = pickDefaultTournamentPhase(phases)

  const [phaseId, setPhaseId] = useState<TournamentPhaseId | null>(defaultPhase)
  const [groupKey, setGroupKey] = useState<string | null>(null)

  const activePhase = phaseId ?? defaultPhase
  const visibleFixtures = useMemo(() => {
    if (!activePhase) return []
    return filterFixturesForTournamentTable(fixtures, activePhase, groupKey)
  }, [activePhase, fixtures, groupKey])

  if (phases.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
        Nenhum jogo classificado por fase ainda. Sincronize o catálogo da Copa.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <TournamentFixtureFilters
        phases={phases}
        groupOptions={groupOptions}
        phaseId={activePhase}
        groupKey={groupKey}
        onPhaseChange={(value) => setPhaseId(value)}
        onGroupChange={setGroupKey}
      />
      <ScheduleFixtureTable
        fixtures={visibleFixtures}
        showGroupColumn={activePhase === 'grupos'}
        showCreateRoomCta={showCreateRoomCta}
      />
    </div>
  )
}

type ScheduleFixtureTableProps = {
  fixtures: CatalogFixtureView[]
  showGroupColumn: boolean
  showCreateRoomCta?: boolean
}

function ScheduleFixtureTable({
  fixtures,
  showGroupColumn,
  showCreateRoomCta = true,
}: ScheduleFixtureTableProps) {
  if (fixtures.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border px-3 py-4 text-center text-sm text-muted-foreground">
        Nenhum jogo neste filtro.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/80">
      <table className="w-full min-w-[20rem] border-collapse text-sm">
        <caption className="sr-only">Jogos da Copa por horário</caption>
        <thead>
          <tr className="border-b border-border/70 bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="px-3 py-2.5">
              Horário
            </th>
            <th scope="col" className="px-3 py-2.5">
              Jogo
            </th>
            {showGroupColumn ? (
              <th scope="col" className="hidden px-3 py-2.5 sm:table-cell">
                Grupo
              </th>
            ) : null}
            <th scope="col" className="px-3 py-2.5 text-center">
              Placar
            </th>
            {showCreateRoomCta ? (
              <th scope="col" className="px-3 py-2.5 text-right">
                Sala
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {fixtures.map((fixture) => (
            <ScheduleFixtureTableRow
              key={fixture.id}
              fixture={fixture}
              showGroupColumn={showGroupColumn}
              showCreateRoomCta={showCreateRoomCta}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

type ScheduleFixtureTableRowProps = {
  fixture: CatalogFixtureView
  showGroupColumn: boolean
  showCreateRoomCta?: boolean
}

function ScheduleFixtureTableRow({
  fixture,
  showGroupColumn,
  showCreateRoomCta = true,
}: ScheduleFixtureTableRowProps) {
  const kickoff = formatFixtureKickoff(fixture.kickoff_at)
  const groupLabel = resolveFixtureGroupLabel(fixture)
  const hasScore =
    fixture.home_goals != null && fixture.away_goals != null
  const meta = [fixture.round, fixture.stage].filter(Boolean).join(' · ')

  return (
    <tr className="border-b border-border/50 last:border-0">
      <td className="whitespace-nowrap px-3 py-3 align-top text-xs text-muted-foreground">
        {kickoff ?? '—'}
      </td>
      <td className="px-3 py-3 align-top">
        <div className="flex items-start gap-2">
          <span className="flex shrink-0 flex-col gap-1">
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
          <span className="min-w-0">
            <span className="block font-semibold leading-snug text-foreground">
              {fixtureDisplayTitle(fixture)}
            </span>
            {meta ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">{meta}</span>
            ) : null}
            {showGroupColumn && groupLabel ? (
              <span className="mt-1 inline-flex sm:hidden">
                <Badge variant="outline">{groupLabel}</Badge>
              </span>
            ) : null}
          </span>
        </div>
      </td>
      {showGroupColumn ? (
        <td className="hidden whitespace-nowrap px-3 py-3 align-top sm:table-cell">
          {groupLabel ? (
            <Badge variant="outline">{groupLabel}</Badge>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </td>
      ) : null}
      <td className="px-3 py-3 text-center align-top font-heading text-base font-black tabular-nums">
        {hasScore ? (
          <>
            {fixture.home_goals}
            <span className="mx-0.5 text-muted-foreground">×</span>
            {fixture.away_goals}
          </>
        ) : (
          <span className="text-sm font-medium text-muted-foreground">—</span>
        )}
      </td>
      {showCreateRoomCta ? (
        <td className="px-3 py-3 text-right align-top">
          <Link
            href={routes.criarSalaComFixture(fixture.id)}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'sm' }),
              'cf-pressable inline-flex min-h-9 whitespace-nowrap'
            )}
          >
            Criar sala
          </Link>
        </td>
      ) : null}
    </tr>
  )
}

export { WorldCupScheduleTable }
