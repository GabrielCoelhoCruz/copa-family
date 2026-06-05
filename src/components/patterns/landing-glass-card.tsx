import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type LandingGlassCardProps = {
  children: ReactNode
  className?: string
  pad?: 'default' | 'none'
}

function LandingGlassCard({
  children,
  className,
  pad = 'default',
}: LandingGlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-[var(--home-glass-border)] bg-[var(--home-glass)] shadow-[0_1px_0_rgba(255,255,255,0.12)_inset,0_20px_40px_-28px_rgba(0,0,0,0.7)] backdrop-blur-[20px] backdrop-saturate-[1.4]',
        pad === 'default' && 'p-[18px]',
        className
      )}
    >
      {children}
    </div>
  )
}

export { LandingGlassCard }
