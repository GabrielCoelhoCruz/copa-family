import { Timer, Zap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CopaPareTimerProps = {
  remainingSeconds: number
  totalSeconds?: number
  categories: string[]
  className?: string
}

function CopaPareTimer({
  remainingSeconds,
  totalSeconds = 30,
  categories,
  className,
}: CopaPareTimerProps) {
  const safeRemainingSeconds = Math.max(0, Math.min(remainingSeconds, totalSeconds))
  const progress = (safeRemainingSeconds / totalSeconds) * 100

  return (
    <Card
      className={cn(
        "border-match-halftime/30 bg-match-halftime/15 shadow-sm shadow-match-halftime/10",
        className
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5 text-brand-party" />
            Copa Pare
          </CardTitle>
          <Badge variant="match-halftime">Intervalo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="text-center">
          <p className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <Timer className="size-4" />
            Tempo restante
          </p>
          <p className="font-heading text-6xl font-black tabular-nums leading-none">
            {safeRemainingSeconds}
          </p>
        </div>

        <div
          className="h-3 overflow-hidden rounded-full bg-background/70"
          aria-label={`Restam ${safeRemainingSeconds} segundos`}
        >
          <div
            className="h-full rounded-full bg-brand-party transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="bg-card/70">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export { CopaPareTimer }
