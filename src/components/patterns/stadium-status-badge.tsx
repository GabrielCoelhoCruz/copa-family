import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_STYLE: Record<
  MatchStatus,
  { label: string; color: string; dot: string; pulse?: boolean }
> = {
  lobby: {
    label: 'Lobby',
    color: 'var(--cf-muted)',
    dot: 'var(--cf-faint)',
  },
  predictions_open: {
    label: 'Palpites abertos',
    color: 'var(--cf-live)',
    dot: 'var(--cf-live)',
  },
  live: {
    label: 'Ao vivo',
    color: 'var(--cf-coral)',
    dot: 'var(--cf-coral)',
    pulse: true,
  },
  halftime: {
    label: 'Intervalo',
    color: 'var(--cf-party)',
    dot: 'var(--cf-party)',
  },
  finished: {
    label: 'Encerrado',
    color: 'var(--cf-gold)',
    dot: 'var(--cf-gold)',
  },
}

type StadiumStatusBadgeProps = {
  status: MatchStatus
  size?: 'sm' | 'md'
  className?: string
}

function StadiumStatusBadge({
  status,
  size = 'md',
  className,
}: StadiumStatusBadgeProps) {
  const s = STATUS_STYLE[status]
  const sm = size === 'sm'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-[20px] bg-black/28 font-extrabold whitespace-nowrap',
        sm ? 'px-2 py-0.5 text-[10.5px] tracking-wide' : 'px-2.5 py-1 text-xs tracking-wide',
        className
      )}
      style={{
        color: s.color,
        border: `1px solid color-mix(in srgb, ${s.color} 33%, transparent)`,
      }}
      aria-live="polite"
      aria-label={`Status da partida: ${s.label}`}
    >
      <span
        className={cn('rounded-full', s.pulse && 'cf-live-dot')}
        style={{
          width: sm ? 6 : 7,
          height: sm ? 6 : 7,
          background: s.dot,
          boxShadow: s.pulse ? `0 0 7px ${s.dot}` : undefined,
        }}
        aria-hidden
      />
      {s.label}
    </span>
  )
}

export { StadiumStatusBadge, STATUS_STYLE }
