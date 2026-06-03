import { TrendingUp } from "lucide-react"

import { cn } from "@/lib/utils"

type PointsDeltaProps = {
  value: number
  label?: string
  className?: string
  /** Destaque extra para +50 / +100 */
  celebrate?: boolean
  /** Desligar pop em listas longas */
  animate?: boolean
}

function PointsDelta({
  value,
  label,
  className,
  celebrate = false,
  animate = true,
}: PointsDeltaProps) {
  const formattedValue = new Intl.NumberFormat("pt-BR", {
    signDisplay: "always",
  }).format(value)

  return (
    <span
      className={cn(
        animate && 'cf-points-pop',
        'inline-flex items-center gap-1 rounded-full border border-points-positive/20 bg-points-positive/10 px-2.5 py-1 font-heading text-sm font-bold tabular-nums text-points-positive',
        celebrate && 'border-brand-trophy/35 bg-brand-trophy/15 text-brand-trophy px-3 py-1.5 text-base',
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
