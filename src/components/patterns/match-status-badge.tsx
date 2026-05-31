import { CircleDot, Pause, Radio, Target, Trophy, Users } from "lucide-react"

import { Badge } from "@/components/ui/badge"

export type MatchStatus =
  | "lobby"
  | "predictions_open"
  | "live"
  | "halftime"
  | "finished"

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
} as const

type MatchStatusBadgeProps = {
  status: MatchStatus
  className?: string
}

function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const view = MATCH_STATUS_VIEW[status]
  const Icon = view.Icon
  const LiveIndicator = status === "live" ? CircleDot : Icon

  return (
    <Badge
      variant={view.variant}
      className={className}
      aria-live="polite"
      aria-label={`Status da partida: ${view.label}`}
      data-match-status={status}
    >
      <LiveIndicator className={status === "live" ? "animate-pulse" : ""} />
      {view.label}
    </Badge>
  )
}

export { MATCH_STATUS_VIEW, MatchStatusBadge }
