import type { ReactNode } from 'react'

import { SiteShell } from '@/components/layouts/site-shell'
import { cn } from '@/lib/utils'

type FlowLayoutProps = {
  children: ReactNode
  className?: string
}

function FlowLayout({ children, className }: FlowLayoutProps) {
  return (
    <SiteShell
      ambient="flow"
      mainClassName={cn(
        'cf-scrollbar-hidden gap-5 p-[var(--site-page-px)] pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
        className
      )}
    >
      {children}
    </SiteShell>
  )
}

export { FlowLayout }
