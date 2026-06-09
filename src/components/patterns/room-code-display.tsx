import Link from 'next/link'
import { MessageCircle, QrCode } from 'lucide-react'

import { RoomCopyButton } from '@/components/room-copy-button'
import { RoomQrPanel } from '@/components/room-qr-panel'
import { buildRoomInviteWhatsAppText, buildWhatsAppShareUrl } from '@/lib/whatsapp-share'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type RoomCodeDisplayProps = {
  roomCode: string
  inviteUrl: string
  salaPath: string
  showQr?: boolean
  className?: string
}

function RoomCodeDisplay({
  roomCode,
  inviteUrl,
  salaPath,
  showQr = false,
  className,
}: RoomCodeDisplayProps) {
  const code = roomCode.toUpperCase()
  const qrHref = showQr ? salaPath : `${salaPath}?qr=1`
  const whatsappText = buildRoomInviteWhatsAppText(roomCode, inviteUrl)
  const whatsappUrl = buildWhatsAppShareUrl({ text: whatsappText })

  return (
    <div className="flex flex-col gap-3">
      <Card
        className={cn(
          'border-brand-trophy/35 bg-gradient-to-br from-brand-trophy/15 via-card to-brand-trophy/5 shadow-md shadow-brand-trophy/10',
          className
        )}
      >
        <CardContent className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">
              Código da sala
            </p>
            <p
              className="break-all font-mono text-3xl font-bold tracking-[0.18em] text-foreground sm:text-4xl sm:tracking-[0.24em]"
              aria-label={`Código ${code.split('').join(' ')}`}
            >
              {code}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <RoomCopyButton inviteUrl={inviteUrl} />
            <Link
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Compartilhar no WhatsApp"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'min-h-11'
              )}
            >
              <MessageCircle />
              WhatsApp
            </Link>
            <Link
              href={qrHref}
              scroll={false}
              data-testid="toggle-room-qr"
              aria-label={showQr ? 'Fechar QR Code' : 'Mostrar QR Code'}
              className={cn(
                buttonVariants({ variant: showQr ? 'default' : 'outline' }),
                'min-h-11'
              )}
            >
              <QrCode />
              {showQr ? 'Fechar QR' : 'QR Code'}
            </Link>
          </div>
        </CardContent>
      </Card>

      {showQr ? (
        <RoomQrPanel inviteUrl={inviteUrl} roomCode={roomCode} />
      ) : null}
    </div>
  )
}

export { RoomCodeDisplay }
