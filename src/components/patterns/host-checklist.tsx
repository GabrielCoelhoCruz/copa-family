import { Check, Circle } from 'lucide-react'

import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type HostChecklistProps = {
  status: MatchStatus
  memberCount: number
  predictionCount: number
  hasMatchResult: boolean
}

const STEPS = [
  { id: 'invite', label: 'Convide a família (link ou QR)' },
  { id: 'predictions', label: 'Abra os palpites' },
  { id: 'start', label: 'Inicie o jogo' },
  { id: 'result', label: 'Informe o resultado final' },
  { id: 'ranking', label: 'Confira o ranking' },
] as const

function HostChecklist({
  status,
  memberCount,
  predictionCount,
  hasMatchResult,
}: HostChecklistProps) {
  const done: Record<string, boolean> = {
    invite: memberCount > 1,
    predictions: status !== 'lobby',
    start: status === 'live' || status === 'halftime' || status === 'finished',
    result: hasMatchResult,
    ranking: hasMatchResult,
  }

  return (
    <section
      className="rounded-2xl border border-border/70 bg-card/60 p-4 shadow-sm"
      aria-labelledby="host-checklist-heading"
    >
      <h2
        id="host-checklist-heading"
        className="font-heading text-lg font-bold tracking-tight"
      >
        Roteiro do anfitrião
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {predictionCount} de {memberCount} já enviaram palpite
      </p>
      <ol className="mt-3 space-y-2">
        {STEPS.map((step) => {
          const isDone = done[step.id]
          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm',
                isDone ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {isDone ? (
                <Check className="size-4 shrink-0 text-match-finished" aria-hidden />
              ) : (
                <Circle className="size-4 shrink-0" aria-hidden />
              )}
              <span>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export { HostChecklist }
