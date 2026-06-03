import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type PageStackProps = {
  children: ReactNode
  className?: string
}

/** Vertical rhythm for in-room and in-flow screens (Impeccable layout). */
function PageStack({ children, className }: PageStackProps) {
  return (
    <div
      className={cn('flex flex-col gap-[var(--site-section-gap)]', className)}
    >
      {children}
    </div>
  )
}

export { PageStack }
