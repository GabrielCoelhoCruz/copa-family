import Link from 'next/link'
import type { ReactNode } from 'react'

import { PointsDelta } from '@/components/patterns/points-delta'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type RoundResultCardProps = {
  title: string
  description?: string
  points?: number
  pointsHint?: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
  icon?: ReactNode
  className?: string
}

function RoundResultCard({
  title,
  description,
  points,
  pointsHint,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  icon,
  className,
}: RoundResultCardProps) {
  return (
    <div
      className={cn(
        'cf-animate-in flex flex-col gap-4 rounded-2xl border border-brand-trophy/30 bg-gradient-to-br from-brand-trophy/12 via-card to-card px-4 py-5 text-center shadow-md',
        className
      )}
      role="status"
    >
      {icon ? (
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-party/15 text-brand-party">
          {icon}
        </div>
      ) : null}
      <div className="space-y-1">
        <p className="font-heading text-xl font-black tracking-tight">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {points != null ? (
        <div className="flex flex-col items-center gap-1">
          <PointsDelta value={points} label="pts" celebrate={points >= 50} />
          {pointsHint ? (
            <p className="text-xs font-semibold text-muted-foreground">{pointsHint}</p>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        <Link
          href={primaryHref}
          className={cn(
            buttonVariants({ variant: 'party', size: 'lg' }),
            'cf-pressable min-h-12 w-full'
          )}
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className={cn(
              buttonVariants({ variant: 'outline', size: 'lg' }),
              'cf-pressable min-h-12 w-full bg-card/80'
            )}
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )
}

export { RoundResultCard }
