'use client'

import { useLayoutEffect, useRef } from 'react'

import { Badge } from '@/components/ui/badge'
import {
  getFixtureDateSectionId,
  type FixtureDateGroup,
} from '@/features/fixtures/calendar-groups'
import { cn } from '@/lib/utils'

type CalendarDayTagsProps = {
  groups: FixtureDateGroup[]
  focusDateKey: string | null
  className?: string
}

function CalendarDayTags({ groups, focusDateKey, className }: CalendarDayTagsProps) {
  const tagListRef = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (!focusDateKey || typeof window === 'undefined') return
    if (window.location.hash) return

    const sectionId = getFixtureDateSectionId(focusDateKey)
    document.getElementById(sectionId)?.scrollIntoView({ block: 'start' })

    const activeTag = tagListRef.current?.querySelector(
      `[data-calendar-day="${focusDateKey}"]`
    )
    activeTag?.scrollIntoView({ inline: 'center', block: 'nearest' })
  }, [focusDateKey])

  if (groups.length === 0) return null

  return (
    <nav
      aria-label="Dias com jogos"
      className={cn(
        'sticky top-0 z-20 -mx-[var(--site-page-px)] space-y-2 border-b border-border/60 bg-background/95 px-[var(--site-page-px)] py-3 backdrop-blur-sm',
        className
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Ir para o dia
      </p>
      <ul
        ref={tagListRef}
        className="flex gap-2 overflow-x-auto pb-0.5 cf-scrollbar-hidden"
      >
        {groups.map((group) => {
          const gameCount = group.fixtures.length
          const gameCountLabel =
            gameCount === 1 ? '1 jogo' : `${gameCount} jogos`
          const isFocused = group.dateKey === focusDateKey

          return (
            <li key={group.dateKey} className="shrink-0">
              <a
                href={`#${getFixtureDateSectionId(group.dateKey)}`}
                data-calendar-day={group.dateKey}
                aria-current={isFocused ? 'location' : undefined}
                className={cn(
                  'cf-pressable inline-flex min-h-10 items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold shadow-sm',
                  'hover:border-brand-field/40 hover:bg-brand-field/10',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isFocused
                    ? 'border-brand-field/50 bg-brand-field/15 ring-1 ring-brand-field/30'
                    : 'border-border/80 bg-card/90'
                )}
              >
                <span className="whitespace-nowrap capitalize">{group.shortLabel}</span>
                <Badge
                  variant={group.isToday ? 'match-live' : 'secondary'}
                  className="tabular-nums"
                  title={gameCountLabel}
                >
                  {gameCount}
                </Badge>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export { CalendarDayTags }
