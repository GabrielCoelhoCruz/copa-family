import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { parseGroupFromRound, parseGroupLetter, parseStageFromRound } from '@/features/fixtures/normalize'
import type { DbFootballFixture } from '@/lib/types'

export type TournamentPhaseId =
  | 'grupos'
  | 'oitavas'
  | 'quartas'
  | 'semifinal'
  | 'terceiro'
  | 'final'
  | 'outros'

export const TOURNAMENT_PHASES: ReadonlyArray<{
  id: TournamentPhaseId
  label: string
}> = [
  { id: 'grupos', label: 'Fase de grupos' },
  { id: 'oitavas', label: 'Oitavas' },
  { id: 'quartas', label: 'Quartas' },
  { id: 'semifinal', label: 'Semifinal' },
  { id: 'terceiro', label: '3º lugar' },
  { id: 'final', label: 'Final' },
  { id: 'outros', label: 'Outros' },
] as const

const PHASE_RANK: Record<TournamentPhaseId, number> = {
  grupos: 0,
  oitavas: 1,
  quartas: 2,
  semifinal: 3,
  terceiro: 4,
  final: 5,
  outros: 6,
}

function phaseBlob(fixture: Pick<DbFootballFixture, 'stage' | 'round' | 'group_name'>): string {
  return [fixture.stage, fixture.round, fixture.group_name]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

function phaseFromParsedStage(round: string | null): TournamentPhaseId | null {
  const label = parseStageFromRound(round)
  if (!label) return null
  if (label === 'Fase de grupos') return 'grupos'
  if (label === 'Oitavas') return 'oitavas'
  if (label === 'Quartas') return 'quartas'
  if (label === 'Semifinal') return 'semifinal'
  if (label === '3º lugar') return 'terceiro'
  if (label === 'Final') return 'final'
  return 'outros'
}

export function resolveFixturePhase(
  fixture: Pick<DbFootballFixture, 'stage' | 'round' | 'group_name'>
): TournamentPhaseId {
  const blob = phaseBlob(fixture)

  if (/grupo\s*[a-h]\b/i.test(blob) || /group\s+[a-h]\b/i.test(blob)) {
    return 'grupos'
  }
  if (/group stage|fase de grupos/i.test(blob)) return 'grupos'

  if (/oitavas|round of 16|1\/8/i.test(blob)) return 'oitavas'
  if (/quartas|quarter.?final|1\/4/i.test(blob)) return 'quartas'
  if (/semifinal|semi.?final/i.test(blob)) return 'semifinal'
  if (/3º|3rd|terceiro|third place/i.test(blob)) return 'terceiro'
  if (/\bfinal\b/i.test(blob) && !/semi|quart|oitav|group|3rd|terceiro/i.test(blob)) {
    return 'final'
  }

  const fromRound = phaseFromParsedStage(fixture.round)
  if (fromRound) return fromRound

  const fromStage = fixture.stage
    ? phaseFromParsedStage(fixture.stage) ??
      (fixture.stage.toLowerCase().includes('grupo') ? 'grupos' : null)
    : null
  if (fromStage) return fromStage

  return 'outros'
}

export function resolveFixtureGroupLabel(
  fixture: Pick<DbFootballFixture, 'group_name' | 'round'>
): string | null {
  if (fixture.group_name?.trim()) {
    return parseGroupLetter(fixture.group_name) ?? fixture.group_name.trim()
  }
  return parseGroupFromRound(fixture.round)
}

export function resolveGroupFilterKey(groupLabel: string | null): string | null {
  if (!groupLabel) return null
  const letter = groupLabel.match(/(?:Grupo\s+)?([A-H])\b/i)?.[1]
  return letter ? letter.toUpperCase() : null
}

export function listTournamentPhasesWithFixtures(
  fixtures: CatalogFixtureView[]
): Array<(typeof TOURNAMENT_PHASES)[number] & { count: number }> {
  const counts = new Map<TournamentPhaseId, number>()
  for (const fixture of fixtures) {
    const phase = resolveFixturePhase(fixture)
    counts.set(phase, (counts.get(phase) ?? 0) + 1)
  }

  return TOURNAMENT_PHASES.filter((phase) => (counts.get(phase.id) ?? 0) > 0).map(
    (phase) => ({
      ...phase,
      count: counts.get(phase.id) ?? 0,
    })
  )
}

export function listGroupFilterOptions(
  fixtures: CatalogFixtureView[]
): Array<{ key: string; label: string }> {
  const keys = new Set<string>()
  for (const fixture of fixtures) {
    if (resolveFixturePhase(fixture) !== 'grupos') continue
    const key = resolveGroupFilterKey(resolveFixtureGroupLabel(fixture))
    if (key) keys.add(key)
  }

  return [...keys]
    .sort()
    .map((key) => ({ key, label: `Grupo ${key}` }))
}

export function filterFixturesForTournamentTable(
  fixtures: CatalogFixtureView[],
  phaseId: TournamentPhaseId,
  groupKey: string | null
): CatalogFixtureView[] {
  let filtered = fixtures.filter((fixture) => resolveFixturePhase(fixture) === phaseId)

  if (phaseId === 'grupos' && groupKey) {
    filtered = filtered.filter(
      (fixture) => resolveGroupFilterKey(resolveFixtureGroupLabel(fixture)) === groupKey
    )
  }

  return [...filtered].sort((a, b) => {
    const aTime = a.kickoff_at ? new Date(a.kickoff_at).getTime() : Number.MAX_SAFE_INTEGER
    const bTime = b.kickoff_at ? new Date(b.kickoff_at).getTime() : Number.MAX_SAFE_INTEGER
    return aTime - bTime
  })
}

export function pickDefaultTournamentPhase(
  phases: Array<{ id: TournamentPhaseId }>
): TournamentPhaseId | null {
  return phases[0]?.id ?? null
}

export function compareTournamentPhases(a: TournamentPhaseId, b: TournamentPhaseId): number {
  return PHASE_RANK[a] - PHASE_RANK[b]
}
