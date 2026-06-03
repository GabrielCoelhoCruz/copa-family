const MAX_SHARE_TEXT_LENGTH = 180

type ScoreShareInput = {
  displayName: string
  roomName: string
  position: number | null
  points: number
  predictionCount: number
  copaPareCount: number
  inviteUrl: string
}

export function sanitizeShareText(value: string, maxLength = MAX_SHARE_TEXT_LENGTH): string {
  return value
    .replace(/[<>]/g, '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

export function buildScoreShareText(input: ScoreShareInput): string {
  const displayName = sanitizeShareText(input.displayName, 40)
  const roomName = sanitizeShareText(input.roomName, 50)
  const position = input.position != null ? `${input.position}º` : 'sem posição ainda'
  const predictionLabel =
    input.predictionCount === 1 ? '1 palpite' : `${input.predictionCount} palpites`
  const copaPareLabel =
    input.copaPareCount === 1 ? '1 Copa Pare' : `${input.copaPareCount} Copa Pare`

  return [
    `${displayName} está em ${position} na sala ${roomName}.`,
    `${input.points.toLocaleString('pt-BR')} pts · ${predictionLabel} · ${copaPareLabel}.`,
    'Vem palpitar e jogar Copa Pare no intervalo:',
    input.inviteUrl,
  ].join('\n')
}
