const WHATSAPP_BASE = 'https://wa.me/'

type WhatsAppShareInput = {
  text: string
}

export function buildWhatsAppShareUrl(input: WhatsAppShareInput): string {
  const encoded = encodeURIComponent(input.text)
  return `${WHATSAPP_BASE}?text=${encoded}`
}

export function buildRoomInviteWhatsAppText(roomCode: string, inviteUrl: string): string {
  const code = roomCode.toUpperCase()
  return [
    `Vem jogar Copa Family com a gente! 🏆`,
    ``,
    `Código da sala: ${code}`,
    ``,
    `Entrar: ${inviteUrl}`,
  ].join('\n')
}
