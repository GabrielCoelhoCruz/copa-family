import { TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

type PointsDeltaProps = {
  value: number
  label?: string
  className?: string
}

function PointsDelta({ value, label, className }: PointsDeltaProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    signDisplay: "always",
  }).format(value)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-points-positive/20 bg-points-positive/10 px-2.5 py-1 font-heading text-sm font-bold tabular-nums text-points-positive",
        className
      )}
    >
      <TrendingUp className="size-3.5" aria-hidden="true" />
      {formattedValue}
      {label ? (
        <span className="font-sans text-xs font-semibold text-muted-foreground">
          {label}
        </span>
      ) : null}
    </span>
  )
}

export { PointsDelta }
