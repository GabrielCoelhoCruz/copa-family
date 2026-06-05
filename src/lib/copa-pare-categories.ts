import { randomInt } from 'crypto'

/** Copa Stop (UI) persists as `copa_pare_*` tables/columns in Postgres. */

export const COPA_PARE_CATEGORIES = [
  { value: 'player', label: 'Jogador', placeholder: 'Ex: Messi' },
  { value: 'team', label: 'Seleção', placeholder: 'Ex: Brasil' },
  { value: 'host_city', label: 'Cidade-sede', placeholder: 'Ex: México' },
  { value: 'stadium', label: 'Estádio', placeholder: 'Ex: Maracanã' },
  { value: 'number_10', label: 'Camisa 10', placeholder: 'Ex: Neymar' },
  { value: 'legend', label: 'Ex-jogador famoso', placeholder: 'Ex: Pelé' },
  {
    value: 'football_thing',
    label: 'Algo que tem no futebol',
    placeholder: 'Ex: Bola',
  },
] as const

export type CopaPareCategoryValue = (typeof COPA_PARE_CATEGORIES)[number]['value']

export const COPA_PARE_CATEGORY_VALUES = COPA_PARE_CATEGORIES.map(
  (category) => category.value
) as [CopaPareCategoryValue, ...CopaPareCategoryValue[]]

export const COPA_PARE_CATEGORY_LABELS: Record<CopaPareCategoryValue, string> =
  Object.fromEntries(
    COPA_PARE_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<CopaPareCategoryValue, string>

const LEGACY_COPA_PARE_CATEGORY_LABELS: Record<string, string> = {
  coach: 'Técnico',
}

/** A–Z minus letters rare in Portuguese STOP rounds */
export const COPA_PARE_LETTERS = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'L',
  'M',
  'N',
  'O',
  'P',
  'R',
  'S',
  'T',
  'U',
  'V',
  'Z',
] as const

function stripAccents(value: string) {
  return value.normalize('NFD').replace(/\p{M}/gu, '')
}

export function normalizeCopaPareAnswer(answer: string): string {
  return stripAccents(answer.trim().toLowerCase())
}

export function normalizeInitial(answer: string): string {
  const stripped = stripAccents(answer.trim())
  if (!stripped) return ''
  return stripped[0]!.toLowerCase()
}

export function answerStartsWithLetter(answer: string, letter: string): boolean {
  const initial = normalizeInitial(answer)
  const expected = stripAccents(letter.trim())[0]?.toLowerCase()
  if (!initial || !expected) return false
  return initial === expected
}

export function drawCopaPareCategory() {
  const index = randomInt(0, COPA_PARE_CATEGORIES.length)
  return COPA_PARE_CATEGORIES[index]!
}

export function drawCopaPareLetter() {
  const index = randomInt(0, COPA_PARE_LETTERS.length)
  return COPA_PARE_LETTERS[index]!
}

export function getCopaPareCategoryByValue(value: string) {
  return COPA_PARE_CATEGORIES.find((category) => category.value === value) ?? null
}

export function copaPareCategoryLabel(value: string): string {
  if (value in COPA_PARE_CATEGORY_LABELS) {
    return COPA_PARE_CATEGORY_LABELS[value as CopaPareCategoryValue]
  }
  return LEGACY_COPA_PARE_CATEGORY_LABELS[value] ?? value
}
