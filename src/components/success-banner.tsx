import { CheckCircle2 } from 'lucide-react'

type SuccessBannerProps = {
  title: string
  description?: string
}

function SuccessBanner({ title, description }: SuccessBannerProps) {
  return (
    <div
      className="flex gap-3 rounded-2xl border border-match-finished/30 bg-match-finished/10 px-4 py-3 shadow-sm"
      role="status"
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-match-finished" />
      <div className="min-w-0 space-y-0.5">
        <p className="font-heading text-sm font-bold text-foreground">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export { SuccessBanner }
