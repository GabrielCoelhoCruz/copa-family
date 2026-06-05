import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import {
  FIXTURE_CALENDAR_TIME_ZONE,
  getFixtureKickoffDateKey,
  getTodayDateKey,
} from '@/features/fixtures/format'

export type FixtureDateGroup = {
  dateKey: string
  label: string
  shortLabel: string
  isToday: boolean
  fixtures: CatalogFixtureView[]
}

export function pickCalendarFocusDateKey(
  groups: FixtureDateGroup[],
  todayKey: string
): string | null {
  if (groups.length === 0) return null

  const datedKeys = groups
    .map((group) => group.dateKey)
    .filter((key) => key !== 'sem-data')

  if (datedKeys.includes(todayKey)) return todayKey

  const nextDay = datedKeys.filter((key) => key >= todayKey).sort()[0]
  if (nextDay) return nextDay

  const previousDay = datedKeys.filter((key) => key < todayKey).sort().at(-1)
  return previousDay ?? groups[0]?.dateKey ?? null
}

export function getFixtureDateSectionId(dateKey: string): string {
  return dateKey === 'sem-data' ? 'dia-sem-data' : `dia-${dateKey}`
}

function formatFixtureDateShortLabel(dateKey: string): string {
  if (dateKey === 'sem-data') return 'A confirmar'
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

export function groupFixturesByKickoffDate(
  fixtures: CatalogFixtureView[],
  options?: {
    todayKey?: string
    timeZone?: string
  }
): FixtureDateGroup[] {
  const timeZone = options?.timeZone ?? FIXTURE_CALENDAR_TIME_ZONE
  const todayKey = options?.todayKey ?? getTodayDateKey(timeZone)
  const groups = new Map<string, CatalogFixtureView[]>()

  for (const fixture of fixtures) {
    const dateKey = fixture.kickoff_at
      ? getFixtureKickoffDateKey(fixture.kickoff_at, timeZone)
      : 'sem-data'
    const list = groups.get(dateKey) ?? []
    list.push(fixture)
    groups.set(dateKey, list)
  }

  return [...groups.entries()].map(([dateKey, groupFixtures]) => {
    const isToday = dateKey === todayKey
    const baseLabel =
      dateKey === 'sem-data'
        ? 'Data a confirmar'
        : new Date(`${dateKey}T12:00:00`).toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })

    return {
      dateKey,
      label: isToday ? `${baseLabel} · Hoje` : baseLabel,
      shortLabel: isToday ? 'Hoje' : formatFixtureDateShortLabel(dateKey),
      isToday,
      fixtures: groupFixtures,
    }
  })
}
