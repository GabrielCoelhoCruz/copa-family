import QRCode from 'qrcode'

export async function generateInviteQrDataUrl(inviteUrl: string) {
  return QRCode.toDataURL(inviteUrl, {
    width: 280,
    margin: 2,
    color: {
      dark: '#1a2e12',
      light: '#fffef8',
    },
  })
}
