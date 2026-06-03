'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Crown, Target, User, Users } from 'lucide-react'

import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    key: 'jogo',
    label: 'Jogo',
    shortLabel: 'Jogo',
    href: (code: string) => routes.sala(code),
    Icon: Users,
    isActive: (code: string, path: string) => path === routes.sala(code),
  },
  {
    key: 'palpites',
    label: 'Palpites',
    shortLabel: 'Palpite',
    href: (code: string) => routes.palpites(code),
    Icon: Target,
    isActive: (_code: string, path: string) => path.includes('/palpites'),
  },
  {
    key: 'ranking',
    label: 'Ranking',
    shortLabel: 'Ranking',
    href: (code: string) => routes.ranking(code),
    Icon: Crown,
    isActive: (_code: string, path: string) => path.includes('/ranking'),
  },
  {
    key: 'perfil',
    label: 'Perfil',
    shortLabel: 'Perfil',
    href: (code: string) => routes.perfil(code),
    Icon: User,
    isActive: (_code: string, path: string) => path.includes('/perfil'),
  },
] as const

type RoomTabNavProps = {
  roomCode: string
}

function RoomTabNav({ roomCode }: RoomTabNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className="border-t border-border/80 bg-card/95 backdrop-blur-md"
      aria-label="Navegação da sala"
    >
      <div className="grid grid-cols-4 gap-1 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {NAV_ITEMS.map((item) => {
          const href = item.href(roomCode)
          const isActive = item.isActive(roomCode, pathname)
          const Icon = item.Icon

          return (
            <Link
              key={item.key}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'relative flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-center text-xs font-semibold transition-[background-color,color,opacity] duration-[var(--duration-fast)]',
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
  )
}

export { RoomTabNav }
