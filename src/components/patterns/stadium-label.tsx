import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StadiumLabelProps = {
  children: ReactNode
  action?: string
  onAction?: () => void
  className?: string
}

function StadiumLabel({ children, action, onAction, className }: StadiumLabelProps) {
  return (
    <div
      className={cn(
        'mb-2.5 flex items-baseline justify-between gap-3 px-0.5',
        className
      )}
    >
      <span className="text-xs font-extrabold uppercase tracking-[0.09em] text-[var(--cf-muted)] whitespace-nowrap">
        {children}
      </span>
      {action ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 cursor-pointer border-0 bg-transparent font-heading text-[13px] font-bold text-[var(--cf-gold)] whitespace-nowrap"
        >
          {action}
        </button>
      ) : null}
    </div>
  )
}

export { StadiumLabel }
