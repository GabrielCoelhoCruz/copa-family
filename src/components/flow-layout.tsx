import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type FlowLayoutProps = {
  children: ReactNode
  className?: string
}

function FlowLayout({ children, className }: FlowLayoutProps) {
  return (
    <main
      className={cn(
        'relative mx-auto flex min-h-dvh w-full max-w-md flex-col gap-5 p-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))]',
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -right-6 top-8 size-44 rounded-full bg-brand-trophy/25 blur-3xl" />
        <div className="absolute -left-10 bottom-32 size-40 rounded-full bg-brand-field/20 blur-3xl" />
        <div className="absolute right-1/4 top-1/2 size-28 rounded-full bg-brand-sky/15 blur-3xl" />
      </div>
      {children}
    </main>
  )
}

export { FlowLayout }
