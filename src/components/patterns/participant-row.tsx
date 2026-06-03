import { Shield } from "lucide-react"

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { truncateDisplayName } from "@/lib/display-text"
import { cn } from "@/lib/utils"

type ParticipantRole = "owner" | "co_host" | "member"

type ParticipantRowProps = {
  name: string
  avatarUrl?: string
  fallback: string
  role?: ParticipantRole
  points?: number
  isOnline?: boolean
  className?: string
}

function ParticipantRow({
  name,
  avatarUrl,
  fallback,
  role = "member",
  points = 0,
  isOnline = false,
  className,
}: ParticipantRowProps) {
  const { display, full } = truncateDisplayName(name)

  return (
    <div
      className={cn(
        "flex min-h-14 items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 text-card-foreground shadow-sm",
        className
      )}
    >
      <Avatar
        size="lg"
        className={
          role === "owner" || role === "co_host" ? "ring-2 ring-brand-trophy" : undefined
        }
      >
        {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
        <AvatarFallback className="bg-brand-party/15 font-heading font-bold text-brand-party">
          {fallback}
        </AvatarFallback>
        {isOnline ? (
          <AvatarBadge className="bg-points-positive" aria-label="Você" />
        ) : null}
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold" title={full}>
            {display}
          </p>
          {role === "owner" ? (
            <Badge variant="rank-gold" className="h-5">
              <Shield />
              Dono
            </Badge>
          ) : null}
          {role === "co_host" ? (
            <Badge variant="points" className="h-5">
              <Shield />
              Co-host
            </Badge>
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {points.toLocaleString("pt-BR")} pontos
        </p>
      </div>
    </div>
  )
}

export { ParticipantRow }
