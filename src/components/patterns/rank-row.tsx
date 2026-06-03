import { Crown, Medal } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { truncateDisplayName } from "@/lib/display-text"
import { cn } from "@/lib/utils"

type RankRowProps = {
  position: number
  name: string
  points: number
  avatarUrl?: string
  fallback: string
  isCurrentUser?: boolean
  detail?: string
  className?: string
}

const TOP_RANK_VARIANTS = {
  1: "rank-gold",
  2: "rank-silver",
  3: "rank-bronze",
} as const

function RankRow({
  position,
  name,
  points,
  avatarUrl,
  fallback,
  isCurrentUser = false,
  detail,
  className,
}: RankRowProps) {
  const topRankVariant =
    TOP_RANK_VARIANTS[position as keyof typeof TOP_RANK_VARIANTS]
  const RankIcon = position === 1 ? Crown : Medal
  const { display, full } = truncateDisplayName(name)

  return (
    <div
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm transition-[background-color,border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-strong)]",
        isCurrentUser && "border-primary/30 bg-primary/5 shadow-primary/10",
        position === 1 && "border-rank-gold/40 bg-rank-gold/10 cf-rank-gold-glow",
        className
      )}
    >
      <div className="flex size-9 items-center justify-center rounded-full bg-muted font-heading text-sm font-bold tabular-nums">
        {position}
      </div>

      <Avatar size="lg">
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback className="bg-brand-sky/15 font-heading font-bold text-brand-sky">
          {fallback}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold" title={full}>
          {display}
          {isCurrentUser ? (
            <span className="sr-only"> (você)</span>
          ) : null}
        </p>
        <p className="font-heading text-lg font-bold tabular-nums text-foreground">
          {points.toLocaleString("pt-BR")} pts
        </p>
        {detail ? (
          <p className="text-xs font-medium text-muted-foreground">{detail}</p>
        ) : null}
      </div>

      {topRankVariant ? (
        <Badge variant={topRankVariant}>
          <RankIcon />
          Top {position}
        </Badge>
      ) : null}
    </div>
  )
}

export { RankRow, TOP_RANK_VARIANTS }
