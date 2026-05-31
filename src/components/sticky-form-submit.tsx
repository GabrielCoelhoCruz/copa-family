import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StickyFormSubmitProps = {
  children: ReactNode
  className?: string
  /** Offset when inside sala layout with bottom tab bar */
  withSalaNav?: boolean
}

function StickyFormSubmit({
  children,
  className,
  withSalaNav = false,
}: StickyFormSubmitProps) {
  return (
    <div
      className={cn(
        'sticky z-30 -mx-1 mt-2 border-t border-border/80 bg-background/95 px-1 pt-3 backdrop-blur-md',
        withSalaNav
          ? 'bottom-[calc(var(--sala-tab-bar-height)+env(safe-area-inset-bottom))]'
          : 'bottom-[env(safe-area-inset-bottom)]',
        className
      )}
    >
      {children}
    </div>
  )
}

export { StickyFormSubmit }
