export type BadgeDefinition = {
  id: string
  label: string
  description: string
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first_prediction',
    label: 'Primeiro Palpite',
    description: 'Enviou palpite na partida',
  },
  {
    id: 'winner_correct',
    label: 'Vidente',
    description: 'Acertou o vencedor',
  },
  {
    id: 'player_correct',
    label: 'Olho de Craque',
    description: 'Acertou o craque da partida',
  },
  {
    id: 'exact_score',
    label: 'Placar Exato',
    description: 'Acertou o placar completo',
  },
  {
    id: 'copa_pare',
    label: 'Maior Torcedor',
    description: 'Participou do Copa Pare',
  },
]

const SOURCE_TO_BADGE: Record<string, string> = {
  prediction_submitted: 'first_prediction',
  match_winner_correct: 'winner_correct',
  match_player_correct: 'player_correct',
  match_exact_score: 'exact_score',
  copa_pare_participation: 'copa_pare',
}

export function getEarnedBadgeIds(sources: Set<string>) {
  const earned = new Set<string>()
  for (const source of sources) {
    const badgeId = SOURCE_TO_BADGE[source]
    if (badgeId) earned.add(badgeId)
  }
  return earned
}
