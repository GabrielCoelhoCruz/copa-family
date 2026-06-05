import type { DbFootballFixture } from '@/lib/types'

export const FIXTURE_CALENDAR_TIME_ZONE = 'America/Sao_Paulo'

export function formatDateKeyInTimeZone(
  date: Date,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function getFixtureKickoffDateKey(
  kickoffAt: string,
  timeZone = FIXTURE_CALENDAR_TIME_ZONE
): string {
  return formatDateKeyInTimeZone(new Date(kickoffAt), timeZone)
}

export function getTodayDateKey(
  timeZone = FIXTURE_CALENDAR_TIME_ZONE,
  now = new Date()
): string {
  return formatDateKeyInTimeZone(now, timeZone)
}

export function formatFixtureKickoff(
  kickoffAt: string | null,
  timeZone = 'America/Sao_Paulo'
): string | null {
  if (!kickoffAt) return null
  return new Date(kickoffAt).toLocaleString('pt-BR', {
    timeZone,
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatFixtureMeta(fixture: DbFootballFixture): string | null {
  const parts: string[] = []
  if (fixture.stage) parts.push(fixture.stage)
  else if (fixture.round) parts.push(fixture.round)
  if (fixture.group_name) parts.push(fixture.group_name)
  if (fixture.venue_name) {
    parts.push(
      fixture.venue_city
        ? `${fixture.venue_name}, ${fixture.venue_city}`
        : fixture.venue_name
    )
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

export function fixtureDisplayTitle(fixture: DbFootballFixture): string {
  return `${fixture.home_team_name} x ${fixture.away_team_name}`
}

export function formatSyncTime(
  iso: string | null,
  timeZone = 'America/Sao_Paulo'
): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    timeZone,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
