import { Zap } from 'lucide-react'

import { StadiumCard } from '@/components/patterns/stadium-card'
import { cn } from '@/lib/utils'

type CopaPareTimerProps = {
  remainingSeconds: number
  totalSeconds?: number
  categoryLabel?: string
  letter?: string
  className?: string
}

function CopaPareTimer({
  remainingSeconds,
  totalSeconds = 30,
  categoryLabel,
  letter,
  className,
}: CopaPareTimerProps) {
  const safeRemainingSeconds = Math.max(0, Math.min(remainingSeconds, totalSeconds))
  const pct = (safeRemainingSeconds / totalSeconds) * 100
  const isUrgent = safeRemainingSeconds > 0 && safeRemainingSeconds <= 10
  const circumference = 2 * Math.PI * 52

  return (
    <div className={cn('space-y-4', className)}>
      <div className="text-center">
        <div className="relative mx-auto size-[116px]">
          <svg
            width="116"
            height="116"
            viewBox="0 0 116 116"
            className="-rotate-90"
            aria-hidden
          >
            <circle
              cx="58"
              cy="58"
              r="52"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
            />
            <circle
              cx="58"
              cy="58"
              r="52"
              fill="none"
              stroke={isUrgent ? 'var(--cf-coral)' : 'var(--cf-party)'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - pct / 100)}
              className="transition-[stroke-dashoffset] duration-1000 linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className={cn(
                'font-heading text-[40px] font-black leading-none tabular-nums',
                isUrgent && 'text-[var(--cf-coral)] cf-timer-urgent'
              )}
              aria-live={isUrgent ? 'assertive' : 'polite'}
            >
              {safeRemainingSeconds}
            </span>
            <span className="text-[10.5px] font-bold tracking-wide text-[var(--cf-faint)]">
              SEGUNDOS
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff6b5e] to-[#ffb33f] px-4 py-1.5 font-heading text-[13px] font-black text-[#3a1500]">
          <Zap className="size-[15px]" aria-hidden />
          COPA STOP
        </span>
      </div>

      {letter ? (
        <div className="text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--cf-muted)]">
            Comece com
          </div>
          <div className="mt-1 font-heading text-[56px] font-black leading-none text-[var(--cf-gold)] drop-shadow-md">
            {letter}
          </div>
        </div>
      ) : null}

      {categoryLabel ? (
        <StadiumCard glow className="text-center">
          <div className="text-xs font-bold uppercase tracking-wide text-[var(--cf-muted)]">
            Categoria
          </div>
          <div className="mt-2 font-heading text-2xl font-black leading-tight text-[var(--cf-party)]">
            {categoryLabel}
          </div>
        </StadiumCard>
      ) : null}
    </div>
  )
}

export { CopaPareTimer }
