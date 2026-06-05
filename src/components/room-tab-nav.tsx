'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Circle, Target, Trophy, User } from 'lucide-react'

import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  {
    key: 'jogo',
    label: 'Jogo',
    href: (code: string) => routes.sala(code),
    Icon: Circle,
    isActive: (code: string, path: string) => path === routes.sala(code),
  },
  {
    key: 'palpites',
    label: 'Palpite',
    href: (code: string) => routes.palpites(code),
    Icon: Target,
    isActive: (_code: string, path: string) => path.includes('/palpites'),
  },
  {
    key: 'ranking',
    label: 'Ranking',
    href: (code: string) => routes.ranking(code),
    Icon: Trophy,
    isActive: (_code: string, path: string) => path.includes('/ranking'),
  },
  {
    key: 'perfil',
    label: 'Perfil',
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
      className="border-t border-[var(--cf-card-border-soft)] bg-[var(--home-chrome-solid)] backdrop-blur-md"
      aria-label="Navegação da sala"
    >
      <div className="grid grid-cols-4 gap-0 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2">
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
              className="flex flex-col items-center gap-1 border-0 bg-transparent px-0 py-1.5"
            >
              <Icon
                className={cn(
                  'size-[23px]',
                  isActive ? 'text-[var(--cf-gold)]' : 'text-[var(--cf-faint)]'
                )}
                strokeWidth={isActive ? 2.4 : 2}
                aria-hidden
              />
              <span
                className={cn(
                  'font-heading text-[11px]',
                  isActive ? 'font-extrabold text-[var(--cf-gold)]' : 'font-semibold text-[var(--cf-faint)]'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export { RoomTabNav }
