import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StickyFormSubmitProps = {
  children: ReactNode
  className?: string
  /** Sticks above the sala bottom tab bar inside the scroll area */
  withSalaNav?: boolean
}

function StickyFormSubmit({
  children,
  className,
  withSalaNav = false,
}: StickyFormSubmitProps) {
  if (withSalaNav) {
    return (
      <>
        <div
          className={cn(
            'sticky z-20 mt-auto shrink-0',
            '-mx-[var(--site-page-px)] px-[var(--site-page-px)]',
            'pt-4 pb-3 cf-sticky-footer',
            className
          )}
          style={{ bottom: 0 }}
        >
          {children}
        </div>
        <div
          aria-hidden
          className="pointer-events-none shrink-0"
          style={{ height: 'var(--sticky-submit-clearance)' }}
        />
      </>
    )
  }

  return (
    <>
      <div
        className={cn(
          'sticky z-20 mt-2 shrink-0 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] cf-sticky-footer',
          className
        )}
        style={{ bottom: 'env(safe-area-inset-bottom)' }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="pointer-events-none shrink-0"
        style={{
          height:
            'calc(var(--sticky-submit-clearance) + env(safe-area-inset-bottom))',
        }}
      />
    </>
  )
}

export { StickyFormSubmit }
