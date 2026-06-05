import Link from 'next/link'
import { CalendarDays, ChevronRight } from 'lucide-react'

import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type RoomCalendarLinkProps = {
  roomCode: string
  className?: string
}

function RoomCalendarLink({ roomCode, className }: RoomCalendarLinkProps) {
  return (
    <Link
      href={routes.calendarioComSala(roomCode)}
      className={cn(
        'cf-pressable flex min-h-10 items-center gap-2 rounded-lg px-1 py-1.5 text-sm font-semibold text-brand-field',
        'hover:bg-brand-field/10 active:bg-brand-field/15',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className
      )}
      aria-label="Ver calendário completo da Copa 2026"
    >
      <CalendarDays className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 truncate">Ver calendário da Copa</span>
      <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden />
    </Link>
  )
}

export { RoomCalendarLink }
