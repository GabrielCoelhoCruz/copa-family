import { routes } from '@/lib/routes'
import type { MatchStatus } from '@/lib/types'

export type RoomStatusEvent = {
  title: string
  description?: string
  href: string
  ctaLabel: string
  /** Shorter copy when Copa Pare pill is already visible */
  compactTitle?: string
}

type ResolveStatusEventInput = {
  roomCode: string
  previousStatus: MatchStatus | null
  nextStatus: MatchStatus
  showCopaPareEvent: boolean
  isNewMatch?: boolean
}

export function resolveStatusEvent(input: ResolveStatusEventInput): RoomStatusEvent | null {
  const { roomCode, previousStatus, nextStatus, showCopaPareEvent, isNewMatch } = input
  const code = roomCode.toUpperCase()

  if (isNewMatch) {
    return {
      title: 'Novo jogo na sala',
      description: 'O anfitrião escolheu outra partida. Confira o placar e os palpites.',
      href: routes.sala(code),
      ctaLabel: 'Ver jogo',
    }
  }

  if (previousStatus === null || previousStatus === nextStatus) {
    return null
  }

  if (nextStatus === 'predictions_open') {
    return {
      title: 'Palpites abertos',
      description: 'Envie seu palpite antes do apito inicial.',
      href: routes.palpites(code),
      ctaLabel: 'Fazer palpite',
    }
  }

  if (nextStatus === 'live') {
    return {
      title: 'Bola rolando',
      description: 'A partida começou na sala.',
      href: routes.sala(code),
      ctaLabel: 'Ver jogo',
    }
  }

  if (nextStatus === 'halftime') {
    if (showCopaPareEvent) {
      return {
        title: 'Intervalo',
        compactTitle: 'Intervalo — Copa Stop aberto',
        href: routes.copaPare(code),
        ctaLabel: 'Jogar Copa Stop',
      }
    }
    return {
      title: 'Intervalo',
      description: 'Confira o ranking enquanto espera o segundo tempo.',
      href: routes.ranking(code),
      ctaLabel: 'Ver ranking',
    }
  }

  if (nextStatus === 'finished') {
    return {
      title: 'Partida encerrada',
      description: 'Veja quem pontuou nesta rodada.',
      href: routes.ranking(code),
      ctaLabel: 'Ver ranking',
    }
  }

  if (nextStatus === 'lobby' && previousStatus !== 'lobby') {
    return {
      title: 'Sala em lobby',
      description: 'Aguarde o anfitrião abrir os palpites.',
      href: routes.sala(code),
      ctaLabel: 'Ver sala',
    }
  }

  return null
}
