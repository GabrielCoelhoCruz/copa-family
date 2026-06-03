import type { ReactNode } from "react"
import { CheckCircle2, Lock, Target } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type PredictionCardState = "open" | "submitted" | "locked"

type PredictionCardProps = {
  title: string
  description: string
  state?: PredictionCardState
  children: ReactNode
  className?: string
}

const PREDICTION_STATE_VIEW = {
  open: {
    label: "Responder",
    variant: "match-predictions",
    Icon: Target,
  },
  submitted: {
    label: "Enviado",
    variant: "match-finished",
    Icon: CheckCircle2,
  },
  locked: {
    label: "Fechado",
    variant: "outline",
    Icon: Lock,
  },
} as const

function PredictionCard({
  title,
  description,
  state = "open",
  children,
  className,
}: PredictionCardProps) {
  const view = PREDICTION_STATE_VIEW[state]
  const Icon = view.Icon

  return (
    <Card
      className={cn(
        "border-brand-sky/25 bg-card shadow-sm",
        state === "open" && "border-brand-sky/35 shadow-brand-sky/10",
        state === "submitted" && "border-match-finished/25 bg-match-finished/5",
        state === "locked" && "opacity-75",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={view.variant}>
            <Icon />
            {view.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export { PREDICTION_STATE_VIEW, PredictionCard }
