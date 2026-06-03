'use client'

import { useState, useTransition } from 'react'

import { submitQuickReactionAction } from '@/features/rooms/actions'
import { cn } from '@/lib/utils'

const QUICK_REACTIONS = ['⚽', '🔥', '😱', '👏', '😂'] as const

type QuickReactionBarProps = {
  matchId: string
  roomId: string
  className?: string
}

function QuickReactionBar({ matchId, roomId, className }: QuickReactionBarProps) {
  const [isPending, startTransition] = useTransition()
  const [activeReaction, setActiveReaction] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReaction = (reaction: string) => {
    setActiveReaction(reaction)
    setError(null)
    window.setTimeout(() => setActiveReaction(null), 1_200)

    startTransition(async () => {
      const result = await submitQuickReactionAction({ matchId, roomId, reaction })
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-2xl border border-brand-field/25 bg-card/90 px-3 py-3 shadow-sm',
        className
      )}
      aria-labelledby="quick-reactions-heading"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 id="quick-reactions-heading" className="font-heading text-base font-bold">
            Reações rápidas
          </h2>
          <p className="text-xs text-muted-foreground">
            Sem chat: só emoção de lance, salva como analytics leve.
          </p>
        </div>
        <div className="flex shrink-0 gap-1" role="group" aria-label="Enviar reação rápida">
          {QUICK_REACTIONS.map((reaction) => (
            <button
              key={reaction}
              type="button"
              className="cf-pressable flex size-10 items-center justify-center rounded-full border border-border/70 bg-background text-lg shadow-sm transition-[transform,background-color] duration-[var(--duration-fast)] hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Enviar reação ${reaction}`}
              disabled={isPending}
              onClick={() => handleReaction(reaction)}
            >
              {reaction}
            </button>
          ))}
        </div>
      </div>

      {activeReaction ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-1 flex justify-center text-4xl"
          aria-hidden
        >
          <span className="cf-points-pop rounded-full bg-brand-trophy/20 px-4 py-2">
            {activeReaction}
          </span>
        </div>
      ) : null}

      {error ? (
        <p className="mt-2 text-xs font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  )
}

export { QuickReactionBar }
