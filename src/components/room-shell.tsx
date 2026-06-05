import type { ReactNode } from 'react'
import Link from 'next/link'
import { QrCode } from 'lucide-react'

import { PageStack } from '@/components/layouts/page-stack'
import { CopaAmbient } from '@/components/patterns/copa-ambient'
import { CopaPareEventPill } from '@/components/patterns/copa-pare-event-pill'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import { RoomTabNav } from '@/components/room-tab-nav'
import { routes } from '@/lib/routes'
import type { MatchStatus } from '@/lib/types'

type RoomShellProps = {
  roomCode: string
  roomName: string
  matchStatus: MatchStatus
  showCopaPareEvent?: boolean
  connectionState?: 'live' | 'reconnecting' | 'polling'
  liveBanner?: ReactNode
  children: ReactNode
}

function RoomShell({
  roomCode,
  roomName,
  matchStatus,
  showCopaPareEvent = false,
  connectionState = 'live',
  liveBanner = null,
  children,
}: RoomShellProps) {
  const code = roomCode.toUpperCase()

  return (
    <div className="relative mx-auto grid h-dvh w-full max-w-md grid-rows-[auto_minmax(0,1fr)_auto]">
      <CopaAmbient variant="sala" className="-z-10" />

      <header className="relative z-20 flex shrink-0 items-center gap-3 border-b border-[var(--cf-card-border-soft)] bg-[var(--home-chrome)] px-[var(--site-page-px)] py-3 backdrop-blur-md">
        <Link
          href={`${routes.sala(roomCode)}?qr=1`}
          scroll={false}
          className="flex min-w-0 flex-1 flex-col items-start gap-0.5 border-0 bg-transparent p-0 text-left"
        >
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-medium tracking-wide text-[var(--cf-gold)]">
            {code}
            <QrCode className="size-3.5" aria-hidden />
          </span>
          <span className="truncate text-[12.5px] font-semibold text-[var(--cf-muted)]">
            {roomName}
          </span>
        </Link>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {connectionState === 'reconnecting' ? (
            <span className="font-mono text-[10px] font-medium tracking-wide text-[var(--cf-muted)]">
              Reconectando…
            </span>
          ) : null}
          <MatchStatusBadge status={matchStatus} variant="stadium" animateOnChange />
        </div>
      </header>

      <main className="cf-scrollbar-hidden relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-[var(--site-page-px)] pb-0 pt-3.5">
        <PageStack className="cf-route-anim flex min-h-0 flex-1 flex-col pb-3">
          {children}
        </PageStack>
      </main>

      <div className="shrink-0">
        {liveBanner ? (
          <div className="px-[var(--site-page-px)] pb-2" role="region" aria-label="Atualização da sala">
            {liveBanner}
          </div>
        ) : null}

        {showCopaPareEvent ? (
          <div
            className="px-[var(--site-page-px)] pb-2"
            role="region"
            aria-label="Copa Pare disponível"
          >
            <CopaPareEventPill roomCode={roomCode} />
          </div>
        ) : null}

        <RoomTabNav roomCode={roomCode} />
      </div>
    </div>
  )
}

export { RoomShell }
