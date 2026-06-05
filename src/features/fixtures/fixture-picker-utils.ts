import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  type FixtureDateGroup,
  groupFixturesByKickoffDate,
  pickCalendarFocusDateKey,
} from '@/features/fixtures/calendar-groups'
import {
  FIXTURE_CALENDAR_TIME_ZONE,
  getFixtureKickoffDateKey,
  getTodayDateKey,
} from '@/features/fixtures/format'
import {
  listTournamentPhasesWithFixtures,
  pickDefaultTournamentPhase,
  resolveFixturePhase,
  type TournamentPhaseId,
} from '@/features/fixtures/tournament-schedule'
import type { DbFootballFixture } from '@/lib/types'

const FINISHED_STATUS_SHORT = new Set(['FT', 'AET', 'PEN', 'AWD', 'WO', 'CANC', 'ABD'])

export type FixturePickerBrowseOptions = {
  todayKey?: string
  timeZone?: string
  preferUpcoming?: boolean
  now?: Date
}

export function getTodayDateKeyForPicker(
  timeZone = FIXTURE_CALENDAR_TIME_ZONE,
  now = new Date()
): string {
  return getTodayDateKey(timeZone, now)
}

export function isCatalogFixtureFinished(
  fixture: Pick<DbFootballFixture, 'status_short' | 'kickoff_at'>,
  now = new Date()
): boolean {
  if (fixture.status_short) {
    const code = fixture.status_short.toUpperCase()
    if (FINISHED_STATUS_SHORT.has(code)) return true
  }
  if (!fixture.kickoff_at) return false
  const kickoffMs = new Date(fixture.kickoff_at).getTime()
  if (Number.isNaN(kickoffMs)) return false
  return kickoffMs < now.getTime() && fixture.status_short !== 'NS'
}

export function filterUpcomingCatalogFixtures(
  fixtures: CatalogFixtureView[],
  now = new Date()
): CatalogFixtureView[] {
  return fixtures.filter((fixture) => !isCatalogFixtureFinished(fixture, now))
}

export function buildFixtureDateGroups(
  fixtures: CatalogFixtureView[],
  options?: FixturePickerBrowseOptions
): FixtureDateGroup[] {
  const timeZone = options?.timeZone ?? FIXTURE_CALENDAR_TIME_ZONE
  const todayKey = options?.todayKey ?? getTodayDateKey(timeZone, options?.now)
  const source = options?.preferUpcoming
    ? filterUpcomingCatalogFixtures(fixtures, options?.now)
    : fixtures

  const groups = groupFixturesByKickoffDate(source, {
    todayKey,
    timeZone,
  })

  return [...groups].sort((a, b) => compareDateKeys(a.dateKey, b.dateKey))
}

function compareDateKeys(a: string, b: string): number {
  if (a === 'sem-data' && b === 'sem-data') return 0
  if (a === 'sem-data') return 1
  if (b === 'sem-data') return -1
  return a.localeCompare(b)
}

export function getFixtureDateKey(
  fixture: Pick<DbFootballFixture, 'kickoff_at'>,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): string {
  if (!fixture.kickoff_at) return 'sem-data'
  return getFixtureKickoffDateKey(fixture.kickoff_at, timeZone)
}

export function getFixturesForDateKey(
  fixtures: CatalogFixtureView[],
  dateKey: string,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): CatalogFixtureView[] {
  return fixtures.filter((fixture) => getFixtureDateKey(fixture, timeZone) === dateKey)
}

export function pickDefaultBrowseDateKey(
  groups: FixtureDateGroup[],
  options: {
    todayKey: string
    selectedFixture?: CatalogFixtureView | null
    preferUpcoming?: boolean
  }
): string | null {
  if (groups.length === 0) return null

  if (options.selectedFixture) {
    const selectedKey = getFixtureDateKey(options.selectedFixture)
    if (groups.some((group) => group.dateKey === selectedKey)) {
      return selectedKey
    }
  }

  const todayGroup = groups.find((group) => group.dateKey === options.todayKey)
  if (todayGroup && todayGroup.fixtures.length > 0) {
    return options.todayKey
  }

  if (options.preferUpcoming) {
    const datedKeys = groups
      .map((group) => group.dateKey)
      .filter((key) => key !== 'sem-data')
      .sort()
    const next = datedKeys.find((key) => key >= options.todayKey)
    if (next) return next
    return datedKeys[0] ?? groups[0]?.dateKey ?? null
  }

  return pickCalendarFocusDateKey(groups, options.todayKey)
}

export function pickDefaultBrowsePhase(
  fixtures: CatalogFixtureView[],
  dateKey: string,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): TournamentPhaseId | null {
  const dayFixtures = getFixturesForDateKey(fixtures, dateKey, timeZone)
  const phases = listTournamentPhasesWithFixtures(dayFixtures)
  return pickDefaultTournamentPhase(phases)
}

export function findFixtureById(
  fixtures: CatalogFixtureView[],
  fixtureId: string | undefined
): CatalogFixtureView | null {
  if (!fixtureId) return null
  return fixtures.find((fixture) => fixture.id === fixtureId) ?? null
}

export function isFixtureOnDateKey(
  fixture: CatalogFixtureView,
  dateKey: string,
  todayKey: string,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): boolean {
  if (dateKey === todayKey) {
    return getFixtureDateKey(fixture, timeZone) === todayKey
  }
  return getFixtureDateKey(fixture, timeZone) === dateKey
}

export function sortFixturesByKickoff(fixtures: CatalogFixtureView[]): CatalogFixtureView[] {
  return [...fixtures].sort((a, b) => {
    const aTime = a.kickoff_at ? new Date(a.kickoff_at).getTime() : Number.MAX_SAFE_INTEGER
    const bTime = b.kickoff_at ? new Date(b.kickoff_at).getTime() : Number.MAX_SAFE_INTEGER
    return aTime - bTime
  })
}

export function countFixturesByPhaseOnDay(
  fixtures: CatalogFixtureView[],
  dateKey: string,
  phaseId: TournamentPhaseId,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): number {
  return getFixturesForDateKey(fixtures, dateKey, timeZone).filter(
    (fixture) => resolveFixturePhase(fixture) === phaseId
  ).length
}
