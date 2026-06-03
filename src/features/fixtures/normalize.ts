/** Provider-neutral normalization for World Cup catalog data. */

/** Knockout bracket placeholders (e.g. 1A, W73, 2B/C). */
const KNOCKOUT_PLACEHOLDER_NAME = /^(1|2|3|W|L)[A-Z0-9/]+$/i

export function isKnockoutPlaceholderName(name: string): boolean {
  return KNOCKOUT_PLACEHOLDER_NAME.test(name.replace(/\s/g, ''))
}

export function slugifyName(value: string): string {  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function parseGroupFromRound(round: string | null): string | null {
  if (!round) return null
  const groupMatch = round.match(/Group\s+([A-H])\b/i)
  return groupMatch ? `Grupo ${groupMatch[1].toUpperCase()}` : null
}

export function parseGroupLetter(group: string | null): string | null {
  if (!group) return null
  const letter = group.trim().toUpperCase()
  if (/^[A-H]$/.test(letter)) return `Grupo ${letter}`
  if (/^Grupo\s+[A-H]$/i.test(letter)) return letter.replace(/^grupo/i, 'Grupo')
  return group
}

export function parseStageFromRound(round: string | null): string | null {
  if (!round) return null
  if (/group/i.test(round)) return 'Fase de grupos'
  if (/round of 16|1\/8|oitavas/i.test(round)) return 'Oitavas'
  if (/quarter|1\/4|quartas/i.test(round)) return 'Quartas'
  if (/semi|1\/2|semifinal/i.test(round)) return 'Semifinal'
  if (/3rd|third place|terceiro/i.test(round)) return '3º lugar'
  if (/final/i.test(round) && !/semi|quarter|round/i.test(round)) return 'Final'
  return round
}

export function buildKickoffAt(
  dateEvent: string | null,
  timeEvent: string | null,
  fallbackUtc?: string | null
): string | null {
  if (fallbackUtc) return fallbackUtc
  if (!dateEvent) return null
  const time = timeEvent?.trim() || '12:00:00'
  const normalizedTime = time.length === 5 ? `${time}:00` : time
  return `${dateEvent}T${normalizedTime}Z`
}

export function buildMatchTitle(
  homeTeamName: string,
  awayTeamName: string,
  round: string | null,
  stage: string | null
): string {
  const teams = `${homeTeamName} x ${awayTeamName}`
  if (round?.trim()) return `${teams} — ${round}`
  if (stage?.trim()) return `${teams} — ${stage}`
  return teams
}

export function venueSlug(name: string, city: string | null): string {
  const base = city ? `${name}-${city}` : name
  return slugifyName(base) || 'venue-unknown'
}
