import { generateInviteQrDataUrl } from '@/lib/invite-qr'

type RoomQrPanelProps = {
  inviteUrl: string
  roomCode: string
}

async function RoomQrPanel({ inviteUrl, roomCode }: RoomQrPanelProps) {
  const code = roomCode.toUpperCase()
  let dataUrl: string | null = null
  let error: string | null = null

  try {
    dataUrl = await generateInviteQrDataUrl(inviteUrl)
  } catch {
    error = 'Não foi possível gerar o QR Code. Use copiar link.'
  }

  return (
    <section
      data-testid="room-qr-dialog"
      aria-labelledby="room-qr-title"
      className="flex flex-col items-center gap-3 rounded-xl border border-border/80 bg-card/90 p-4"
    >
      <div className="w-full text-center">
        <h3 id="room-qr-title" className="font-heading text-base font-bold">
          QR Code da sala
        </h3>
        <p className="text-sm text-muted-foreground">
          Escaneie para entrar com o código{' '}
          <span className="font-mono font-semibold text-foreground">{code}</span>
        </p>
      </div>

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- data URL from qrcode
        <img
          src={dataUrl}
          alt={`QR Code do link de convite da sala ${code}`}
          width={280}
          height={280}
          className="rounded-xl border border-border bg-brand-cream p-2"
        />
      ) : null}

      <p className="max-w-full break-all text-center text-xs text-muted-foreground">
        {inviteUrl}
      </p>
    </section>
  )
}

export { RoomQrPanel }
