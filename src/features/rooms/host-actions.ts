import type { LucideIcon } from 'lucide-react'
import { Pause, Play, Target, Trophy } from 'lucide-react'

import type { MatchStatus } from '@/lib/types'

export type HostAction = {
  nextStatus: MatchStatus
  label: string
  description: string
  variant: 'party' | 'default' | 'celebrate' | 'success'
  Icon: LucideIcon
}

export function getPrimaryHostAction(status: MatchStatus): HostAction | null {
  const actions: Record<MatchStatus, HostAction | null> = {
    lobby: {
      nextStatus: 'predictions_open',
      label: 'Abrir palpites',
      description: 'Libere a família para enviar palpites antes do jogo.',
      variant: 'party',
      Icon: Target,
    },
    predictions_open: {
      nextStatus: 'live',
      label: 'Iniciar jogo',
      description: 'Feche os palpites e comece a partida ao vivo.',
      variant: 'default',
      Icon: Play,
    },
    live: {
      nextStatus: 'halftime',
      label: 'Abrir intervalo',
      description: 'Ative o Copa Pare e o momento de conversa.',
      variant: 'celebrate',
      Icon: Pause,
    },
    halftime: {
      nextStatus: 'live',
      label: 'Retomar jogo',
      description: 'Volte ao jogo ao vivo após o intervalo.',
      variant: 'default',
      Icon: Play,
    },
    finished: null,
  }

  return actions[status]
}

export function getSecondaryHostActions(status: MatchStatus): HostAction[] {
  if (status === 'live' || status === 'halftime') {
    return [
      {
        nextStatus: 'finished',
        label: 'Encerrar partida',
        description: 'Finalize e informe o resultado na aba Jogo.',
        variant: 'success',
        Icon: Trophy,
      },
    ]
  }
  return []
}

export function getHostNextStepHint(status: MatchStatus): string {
  const hints: Record<MatchStatus, string> = {
    lobby: 'Convide pelo QR e abra os palpites.',
    predictions_open: 'Confira quem já palpitou e inicie o jogo.',
    live: 'No intervalo, abra o Copa Pare para +100 pts.',
    halftime: 'Copa Pare ativo. Depois retome ou encerre.',
    finished: 'Informe o resultado e veja o ranking final.',
  }
  return hints[status]
}
