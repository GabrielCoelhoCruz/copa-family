import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StickyFormSubmitProps = {
  children: ReactNode
  className?: string
  /** Sticks to the bottom of the sala scroll area (above tab bar) */
  withSalaNav?: boolean
}

function StickyFormSubmit({
  children,
  className,
  withSalaNav = false,
}: StickyFormSubmitProps) {
  return (
    <>
      <div
        className={cn(
          'sticky z-10 mt-2 border-t border-border/80 bg-background/95 pt-3 backdrop-blur-md',
          className
        )}
        style={{
          bottom: withSalaNav ? 0 : 'env(safe-area-inset-bottom)',
        }}
      >
        {children}
      </div>
      {/* Reserves scroll space so fields are not hidden under the sticky bar */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none h-0 w-full',
          withSalaNav
            ? 'pb-[var(--sticky-submit-clearance)]'
            : 'pb-[calc(var(--sticky-submit-clearance)+env(safe-area-inset-bottom))]'
        )}
      />
    </>
  )
}

export { StickyFormSubmit }
