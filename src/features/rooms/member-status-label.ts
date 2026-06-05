import type { MatchStatus } from '@/lib/types'

export function buildMemberStatusLabel(
  status: MatchStatus,
  hasPrediction: boolean,
  hasCopaPare: boolean
): string {
  if (status === 'lobby' || status === 'predictions_open') {
    return hasPrediction ? 'palpitou' : 'aguardando palpite'
  }

  if (status === 'halftime' || status === 'live') {
    const parts: string[] = []
    parts.push(hasPrediction ? 'palpitou' : 'sem palpite')
    parts.push(hasCopaPare ? 'Copa Pare' : 'sem Copa Pare')
    return parts.join(' · ')
  }

  const parts: string[] = []
  if (hasPrediction) parts.push('palpitou')
  if (hasCopaPare) parts.push('Copa Pare')
  return parts.length > 0 ? parts.join(' · ') : 'na sala'
}
