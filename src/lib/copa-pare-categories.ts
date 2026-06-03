export const COPA_PARE_CATEGORIES = [
  { value: 'player', label: 'Jogador', placeholder: 'Ex: Neymar' },
  { value: 'team', label: 'Seleção', placeholder: 'Ex: Brasil' },
  { value: 'coach', label: 'Técnico', placeholder: 'Ex: Dorival' },
  { value: 'stadium', label: 'Estádio', placeholder: 'Ex: Maracanã' },
] as const

export type CopaPareCategoryValue = (typeof COPA_PARE_CATEGORIES)[number]['value']

export const COPA_PARE_CATEGORY_LABELS: Record<CopaPareCategoryValue, string> =
  Object.fromEntries(
    COPA_PARE_CATEGORIES.map((category) => [category.value, category.label])
  ) as Record<CopaPareCategoryValue, string>

export function pickCopaPareCategory(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % COPA_PARE_CATEGORIES.length
  return COPA_PARE_CATEGORIES[index]!
}
