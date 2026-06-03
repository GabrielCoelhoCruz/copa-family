import type { ReactNode } from 'react'

import { FlowLayout } from '@/components/flow-layout'
import { PageTopBar } from '@/components/layouts/page-top-bar'

type FlowPageProps = {
  backHref: string
  backLabel?: string
  title: string
  description?: string
  children: ReactNode
}

function FlowPage({
  backHref,
  backLabel,
  title,
  description,
  children,
}: FlowPageProps) {
  return (
    <FlowLayout>
      <PageTopBar href={backHref} label={backLabel} />
      <header className="space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
      {children}
    </FlowLayout>
  )
}

export { FlowPage }
