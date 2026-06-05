'use client'

import { useState, useTransition } from 'react'

import { StadiumCard } from '@/components/patterns/stadium-card'
import { submitQuickReactionAction } from '@/features/rooms/actions'
import { cn } from '@/lib/utils'

const QUICK_REACTIONS = ['⚽', '🔥', '😱', '👏', '🎉', '🇧🇷'] as const

type QuickReactionBarProps = {
  matchId: string
  roomId: string
  className?: string
}

function QuickReactionBar({ matchId, roomId, className }: QuickReactionBarProps) {
  const [isPending, startTransition] = useTransition()
  const [burst, setBurst] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReaction = (reaction: string) => {
    setBurst(reaction)
    window.setTimeout(() => setBurst(null), 600)

    startTransition(async () => {
      const result = await submitQuickReactionAction({ matchId, roomId, reaction })
      if (result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <StadiumCard glass pad={12} className={className}>
      <p className="mb-2.5 text-center text-[12.5px] font-bold text-[var(--cf-muted)]">
        Reaja com a família
      </p>
      <div className="flex justify-between gap-1.5" role="group" aria-label="Enviar reação rápida">
        {QUICK_REACTIONS.map((reaction) => (
          <button
            key={reaction}
            type="button"
            className={cn(
              'cf-pressable flex h-[46px] flex-1 items-center justify-center rounded-[13px] border text-[22px] transition-transform',
              burst === reaction
                ? 'scale-[1.18] border-[rgba(230,197,119,0.35)] bg-[rgba(230,197,119,0.18)]'
                : 'border-[var(--cf-card-border-soft)] bg-white/5'
            )}
            aria-label={`Enviar reação ${reaction}`}
            disabled={isPending}
            onClick={() => handleReaction(reaction)}
          >
            {reaction}
          </button>
        ))}
      </div>
      {error ? (
        <p className="mt-2 text-center text-xs font-semibold text-[var(--cf-coral)]" role="alert">
          {error}
        </p>
      ) : null}
    </StadiumCard>
  )
}

export { QuickReactionBar }
