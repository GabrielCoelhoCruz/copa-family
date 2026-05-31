import type { ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("border-dashed bg-card/80", className)}>
      <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
        {icon ? (
          <div className="flex size-12 items-center justify-center rounded-full bg-brand-trophy/15 text-brand-party">
            {icon}
          </div>
        ) : null}
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-bold">{title}</h2>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="pt-2">{action}</div> : null}
      </CardContent>
    </Card>
  )
}

export { EmptyState }
