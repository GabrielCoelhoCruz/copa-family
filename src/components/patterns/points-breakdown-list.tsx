import { PointsDelta } from '@/components/patterns/points-delta'
import type { PointsBreakdownRow } from '@/lib/points-breakdown'
import { cn } from '@/lib/utils'

type PointsBreakdownListProps = {
  rows: PointsBreakdownRow[]
  className?: string
  emptyMessage?: string
}

function PointsBreakdownList({
  rows,
  className,
  emptyMessage = 'Nenhum ponto registrado ainda.',
}: PointsBreakdownListProps) {
  if (rows.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>{emptyMessage}</p>
    )
  }

  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {rows.map((row) => (
        <li
          key={row.source}
          className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/70 px-3 py-2"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold">{row.label}</p>
            {row.count > 1 ? (
              <p className="text-xs text-muted-foreground">{row.count} vezes</p>
            ) : null}
            {row.detail ? (
              <p className="text-xs font-medium text-brand-trophy">{row.detail}</p>
            ) : null}
          </div>
          <PointsDelta value={row.amount} animate={false} celebrate={row.amount >= 50} />
        </li>
      ))}
    </ul>
  )
}

export { PointsBreakdownList }
