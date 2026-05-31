import type { MatchStatus } from '@/lib/types'

const ALLOWED_TRANSITIONS: Record<MatchStatus, MatchStatus[]> = {
  lobby: ['predictions_open'],
  predictions_open: ['live'],
  live: ['halftime', 'finished'],
  halftime: ['live', 'finished'],
  finished: [],
}

export function canTransitionMatchStatus(
  current: MatchStatus,
  next: MatchStatus
): boolean {
  return ALLOWED_TRANSITIONS[current].includes(next)
}

export function getInvalidTransitionMessage(
  current: MatchStatus,
  next: MatchStatus
): string {
  if (current === next) {
    return 'A partida já está neste status.'
  }
  if (current === 'finished') {
    return 'A partida já foi encerrada.'
  }
  if (next === 'predictions_open' && current !== 'lobby') {
    return 'Só é possível abrir palpites a partir do lobby.'
  }
  if (next === 'live' && current !== 'predictions_open' && current !== 'halftime') {
    return 'Inicie o jogo com palpites abertos ou retome após o intervalo.'
  }
  return 'Essa mudança de status não é permitida agora.'
}
