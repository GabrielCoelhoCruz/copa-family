export type DesignSystemMember = {
  id: string
  name: string
  initial: string
  color: string
  roomPts: number
  you?: boolean
}

export const DESIGN_SYSTEM_MEMBERS: DesignSystemMember[] = [
  { id: 'lu', name: 'Lucas', initial: 'L', color: '#3b82f6', roomPts: 38 },
  { id: 'ma', name: 'Maria', initial: 'M', color: '#ec4899', roomPts: 34 },
  { id: 'vi', name: 'Vitória', initial: 'V', color: '#10b981', roomPts: 31, you: true },
  { id: 'pe', name: 'Pedro', initial: 'P', color: '#f59e0b', roomPts: 27 },
  { id: 'an', name: 'Ana', initial: 'A', color: '#8b5cf6', roomPts: 22 },
]

export const FIFA_FLAG_ISO: Record<string, string> = {
  BRA: 'br',
  ARG: 'ar',
  FRA: 'fr',
  POR: 'pt',
  ESP: 'es',
  GER: 'de',
  ENG: 'gb-eng',
  NED: 'nl',
}
