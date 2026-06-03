import { CheckCircle2 } from 'lucide-react'

import { PointsDelta } from '@/components/patterns/points-delta'

type SuccessBannerProps = {
  title: string
  description?: string
  points?: number
}

function SuccessBanner({ title, description, points }: SuccessBannerProps) {
  return (
    <div
      className="cf-animate-in flex gap-3 rounded-2xl border border-match-finished/30 bg-gradient-to-br from-match-finished/15 to-card px-4 py-3 shadow-sm"
      role="status"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-match-finished" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="space-y-0.5">
          <p className="font-heading text-sm font-bold text-foreground">{title}</p>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {points != null ? (
          <PointsDelta value={points} label="pts" celebrate={points >= 50} />
        ) : null}
      </div>
    </div>
  )
}

export { SuccessBanner }
