import { POINTS } from '@/features/points/rules'
import { routes } from '@/lib/routes'
import type { MatchStatus } from '@/lib/types'

export type RoomNextActionAnchorTarget =
  | 'convite-sala'
  | 'host-game-control'
  | 'proximo-jogo-heading'

export type RoomNextAction = {
  title: string
  description: string
  href: string
  ctaLabel: string
  emphasis: 'party' | 'default' | 'outline'
  ctaKind: 'link' | 'anchor'
  anchorTargetId?: RoomNextActionAnchorTarget
}

type ResolveRoomNextActionInput = {
  roomCode: string
  status: MatchStatus
  isOwner: boolean
  hasPrediction: boolean
  hasCopaPareEntry: boolean
  predictionCount: number
  memberCount: number
}

export function resolveRoomNextAction(
  input: ResolveRoomNextActionInput
): RoomNextAction {
  const {
    roomCode,
    status,
    isOwner,
    hasPrediction,
    hasCopaPareEntry,
    predictionCount,
    memberCount,
  } = input

  if (status === 'predictions_open') {
    if (!hasPrediction) {
      return {
        title: 'Palpites abertos',
        description: 'Envie seu palpite antes do apito inicial.',
        href: routes.palpites(roomCode),
        ctaLabel: 'Fazer palpite',
        emphasis: 'party',
        ctaKind: 'link',
      }
    }
    return {
      title: 'Palpite enviado',
      description: `${predictionCount} palpite(s) na sala. Você já participou.`,
      href: routes.palpites(roomCode),
      ctaLabel: 'Ver meu palpite',
      emphasis: 'outline',
      ctaKind: 'link',
    }
  }

  if (status === 'halftime') {
    if (!hasCopaPareEntry) {
      return {
        title: 'Intervalo',
        description: `Copa Stop: 30 segundos, +${POINTS.copaPareParticipation} pts (+${POINTS.copaPareUnique} se único).`,
        href: routes.copaPare(roomCode),
        ctaLabel: 'Jogar Copa Stop',
        emphasis: 'party',
        ctaKind: 'link',
      }
    }
    return {
      title: 'Copa Stop enviado',
      description: 'Confira quem está na frente no ranking.',
      href: routes.ranking(roomCode),
      ctaLabel: 'Ver ranking',
      emphasis: 'default',
      ctaKind: 'link',
    }
  }

  if (status === 'live') {
    return {
      title: 'Bola rolando',
      description: 'Reaja aos lances na sala e espere o intervalo para Copa Stop.',
      href: routes.sala(roomCode),
      ctaLabel: 'Ver jogo da sala',
      emphasis: 'outline',
      ctaKind: 'link',
    }
  }

  if (status === 'finished') {
    if (isOwner) {
      return {
        title: 'Rodada encerrada',
        description: 'Confira o ranking e escolha o próximo jogo da mesma sala.',
        href: routes.sala(roomCode),
        ctaLabel: 'Escolher próximo jogo',
        emphasis: 'party',
        ctaKind: 'anchor',
        anchorTargetId: 'proximo-jogo-heading',
      }
    }
    return {
      title: 'Rodada encerrada',
      description: 'Veja o placar de pontos e quem lidera a família.',
      href: routes.ranking(roomCode),
      ctaLabel: 'Ver ranking completo',
      emphasis: 'default',
      ctaKind: 'link',
    }
  }

  if (isOwner) {
    const needsInvite = memberCount < 2
    return {
      title: needsInvite ? 'Convide a família' : 'Sala pronta',
      description: needsInvite
        ? 'Compartilhe o link ou QR para começar os palpites.'
        : `${memberCount} jogadores · abra os palpites quando todos entrarem.`,
      href: routes.sala(roomCode),
      ctaLabel: needsInvite ? 'Convidar abaixo' : 'Gerenciar partida',
      emphasis: 'outline',
      ctaKind: 'anchor',
      anchorTargetId: needsInvite ? 'convite-sala' : 'host-game-control',
    }
  }

  return {
    title: 'Aguardando o anfitrião',
    description: 'Quando os palpites abrirem, você recebe o CTA aqui.',
    href: routes.sala(roomCode),
    ctaLabel: 'Atualizar',
    emphasis: 'outline',
    ctaKind: 'link',
  }
}
