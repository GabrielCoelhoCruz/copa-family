import { CircleDot, Pause, Radio, Target, Trophy, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import type { MatchStatus } from '@/lib/types'

const MATCH_STATUS_VIEW = {
  lobby: {
    label: "Lobby",
    variant: "match-lobby",
    Icon: Users,
  },
  predictions_open: {
    label: "Palpites abertos",
    variant: "match-predictions",
    Icon: Target,
  },
  live: {
    label: "Ao vivo",
    variant: "match-live",
    Icon: Radio,
  },
  halftime: {
    label: "Intervalo",
    variant: "match-halftime",
    Icon: Pause,
  },
  finished: {
    label: "Encerrado",
    variant: "match-finished",
    Icon: Trophy,
  },
} satisfies Record<
  MatchStatus,
  {
    label: string
    variant: 'match-lobby' | 'match-predictions' | 'match-live' | 'match-halftime' | 'match-finished'
    Icon: typeof Users
  }
>

type MatchStatusBadgeProps = {
  status: MatchStatus
  className?: string
  /** Re-mount + entrance animation when status changes */
  animateOnChange?: boolean
}

function MatchStatusBadge({ status, className, animateOnChange = false }: MatchStatusBadgeProps) {
  const view = MATCH_STATUS_VIEW[status]
  const Icon = view.Icon
  const LiveIndicator = status === "live" ? CircleDot : Icon

  const badge = (
    <Badge
      variant={view.variant}
      className={className}
      aria-live="polite"
      aria-label={`Status da partida: ${view.label}`}
      data-match-status={status}
    >
      <LiveIndicator className={status === 'live' ? 'cf-live-dot' : ''} />
      {view.label}
    </Badge>
  )

  if (!animateOnChange) return badge

  return (
    <div key={status} className="cf-status-swap">
      {badge}
    </div>
  )
}

export { MATCH_STATUS_VIEW, MatchStatusBadge }
