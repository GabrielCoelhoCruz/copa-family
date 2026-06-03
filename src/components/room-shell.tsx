import { PageStack } from '@/components/layouts/page-stack'
import { RoomTabNav } from '@/components/room-tab-nav'
import { CopaAmbient } from '@/components/patterns/copa-ambient'
import { CopaPareEventPill } from '@/components/patterns/copa-pare-event-pill'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import type { MatchStatus } from '@/lib/types'

type RoomShellProps = {
  roomCode: string
  roomName: string
  matchStatus: MatchStatus
  showCopaPareEvent?: boolean
  children: React.ReactNode
}

function RoomShell({
  roomCode,
  roomName,
  matchStatus,
  showCopaPareEvent = false,
  children,
}: RoomShellProps) {
  return (
    <div className="relative mx-auto grid h-dvh w-full max-w-md grid-rows-[auto_minmax(0,1fr)_auto]">
      <CopaAmbient variant="sala" className="-z-10" />

      <header className="space-y-1 px-[var(--site-page-px)] pt-4">
        <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sala · {roomCode}
              </p>
              <h1 className="truncate font-heading text-2xl font-bold leading-tight">
                {roomName}
              </h1>
            </div>
            <div className="shrink-0 self-start">
              <MatchStatusBadge status={matchStatus} animateOnChange />
            </div>
          </div>
        </div>
      </header>

      <main className="cf-scrollbar-hidden min-h-0 overflow-y-auto overscroll-y-contain px-[var(--site-page-px)] pb-4 pt-4">
        <PageStack>{children}</PageStack>
      </main>

      <div className="shrink-0">
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
