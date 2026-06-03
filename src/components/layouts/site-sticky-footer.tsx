import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SiteStickyFooterProps = {
  children: ReactNode
  className?: string
}

function SiteStickyFooter({ children, className }: SiteStickyFooterProps) {
  return (
    <footer
      className={cn(
        'sticky bottom-[env(safe-area-inset-bottom)] z-20 shrink-0 border-t border-border/80 bg-background/95 px-[var(--site-page-px)] pt-3 backdrop-blur-md cf-animate-in',
        className
      )}
    >
      {children}
    </footer>
  )
}

export { SiteStickyFooter }
