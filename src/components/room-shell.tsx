'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crown, PartyPopper, Target, User, Users } from 'lucide-react'

import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import { routes } from '@/lib/routes'
import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type RoomShellProps = {
  roomCode: string
  roomName: string
  matchStatus: MatchStatus
  children: React.ReactNode
}

function RoomShell({ roomCode, roomName, matchStatus, children }: RoomShellProps) {
  const pathname = usePathname()
  const showCopaPare =
    matchStatus === 'halftime' || matchStatus === 'live'

  const navItems = [
    {
      label: 'Lobby',
      shortLabel: 'Lobby',
      href: routes.sala(roomCode),
      Icon: Users,
    },
    {
      label: 'Palpites',
      shortLabel: 'Palpite',
      href: routes.palpites(roomCode),
      Icon: Target,
    },
    ...(showCopaPare
      ? [
          {
            label: 'Copa Pare',
            shortLabel: 'Pare',
            href: routes.copaPare(roomCode),
            Icon: PartyPopper,
          },
        ]
      : []),
    {
      label: 'Ranking',
      shortLabel: 'Ranking',
      href: routes.ranking(roomCode),
      Icon: Crown,
    },
  ] as const

  const perfilHref = routes.perfil(roomCode)
  const isPerfilActive = pathname === perfilHref

  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-4 top-0 size-36 rounded-full bg-brand-trophy/20 blur-3xl" />
        <div className="absolute -left-8 bottom-40 size-32 rounded-full bg-brand-field/15 blur-3xl" />
      </div>

      <header className="shrink-0 space-y-1 px-4 pt-4">
        <div className="rounded-2xl border border-border/80 bg-card/90 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Sala · {roomCode}
              </p>
              <h1 className="truncate font-heading text-2xl font-bold leading-tight">
                {roomName}
              </h1>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <MatchStatusBadge status={matchStatus} />
              <Link
                href={perfilHref}
                aria-current={isPerfilActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-9 min-w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors',
                  isPerfilActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:bg-muted/80'
                )}
                aria-label="Meu perfil e medalhas"
              >
                <User className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className="flex-1 px-4 pb-[calc(var(--sala-tab-bar-height)+env(safe-area-inset-bottom)+1rem)] pt-4"
      >
        {children}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-card/95 backdrop-blur-md"
        aria-label="Navegação da sala"
      >
        <div
          className={cn(
            'mx-auto grid w-full max-w-md gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2',
            showCopaPare ? 'grid-cols-4' : 'grid-cols-3'
          )}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.Icon

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-center text-xs font-semibold transition-[background-color,color] duration-[var(--duration-fast)]',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground active:bg-muted/80'
                )}
              >
                <Icon className="size-5" aria-hidden />
                <span>{item.shortLabel}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

export { RoomShell }
