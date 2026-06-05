'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useEffect } from 'react'

import { buttonVariants } from '@/components/ui/button'
import type { RoomStatusEvent } from '@/features/rooms/live/room-status-events'
import { cn } from '@/lib/utils'

const AUTO_DISMISS_MS = 8_000

type RoomLiveBannerProps = {
  event: RoomStatusEvent
  compact?: boolean
  onDismiss: () => void
}

function RoomLiveBanner({ event, compact = false, onDismiss }: RoomLiveBannerProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [event.title, event.href, onDismiss])

  const title = compact && event.compactTitle ? event.compactTitle : event.title

  return (
    <div
      className={cn(
        'cf-animate-in relative flex gap-2 rounded-2xl border border-[var(--cf-gold)]/35 bg-[var(--home-chrome)] px-3 py-2.5 shadow-md motion-reduce:transition-none'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <p className="font-heading text-sm font-bold leading-tight text-foreground">{title}</p>
        {!compact && event.description ? (
          <p className="text-xs leading-snug text-muted-foreground">{event.description}</p>
        ) : null}
        <Link
          href={event.href}
          className={cn(buttonVariants({ variant: 'party', size: 'sm' }), 'h-8 w-full sm:w-auto')}
          onClick={onDismiss}
        >
          {event.ctaLabel}
        </Link>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="cf-pressable shrink-0 rounded-lg p-1 text-muted-foreground hover:text-foreground"
        aria-label="Fechar aviso"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export { RoomLiveBanner }
