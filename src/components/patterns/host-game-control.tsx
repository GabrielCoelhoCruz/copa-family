'use client'

import { useFormStatus } from 'react-dom'
import { Check, ChevronRight, Circle, Users } from 'lucide-react'

import { updateMatchStatusFormAction } from '@/features/rooms/actions'
import {
  getHostNextStepHint,
  getPrimaryHostAction,
  getSecondaryHostActions,
  type HostAction,
} from '@/features/rooms/host-actions'
import { MatchStatusBadge } from '@/components/patterns/match-status-badge'
import { Button } from '@/components/ui/button'
import type { MatchStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

type HostGameControlProps = {
  status: MatchStatus
  matchId: string
  roomId: string
  roomCode: string
  memberCount: number
  predictionCount: number
  hasMatchResult: boolean
}

const STEPS = [
  { id: 'invite', label: 'Convide a família' },
  { id: 'predictions', label: 'Abra os palpites' },
  { id: 'start', label: 'Inicie o jogo' },
  { id: 'result', label: 'Informe o resultado' },
] as const

function HostActionForm({
  action,
  matchId,
  roomId,
  roomCode,
  size = 'default',
}: {
  action: HostAction
  matchId: string
  roomId: string
  roomCode: string
  size?: 'default' | 'sm'
}) {
  const { pending } = useFormStatus()
  const Icon = action.Icon

  return (
    <form action={updateMatchStatusFormAction}>
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="roomCode" value={roomCode} />
      <input type="hidden" name="status" value={action.nextStatus} />
      <Button
        type="submit"
        variant={action.variant}
        className={cn('w-full', size === 'default' ? 'min-h-12' : 'min-h-10')}
        disabled={pending}
      >
        <Icon />
        {action.label}
      </Button>
    </form>
  )
}

function HostGameControl({
  status,
  matchId,
  roomId,
  roomCode,
  memberCount,
  predictionCount,
  hasMatchResult,
}: HostGameControlProps) {
  const primary = getPrimaryHostAction(status)
  const secondary = getSecondaryHostActions(status)
  const hint = getHostNextStepHint(status)
  const missingPredictions = Math.max(0, memberCount - predictionCount)
  const needsResult = status === 'finished' && !hasMatchResult

  const done: Record<string, boolean> = {
    invite: memberCount > 1,
    predictions: status !== 'lobby',
    start: status === 'live' || status === 'halftime' || status === 'finished',
    result: hasMatchResult,
  }

  return (
    <section
      id="host-game-control"
      className="rounded-2xl border border-brand-field/30 bg-gradient-to-br from-brand-field/10 via-card to-card p-4 shadow-md"
      aria-labelledby="host-control-heading"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="host-control-heading" className="font-heading text-lg font-bold">
            Anfitrião
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{hint}</p>
        </div>
        <MatchStatusBadge status={status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-center">
          <p className="flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground">
            <Users className="size-3.5" aria-hidden />
            Jogadores
          </p>
          <p className="font-heading text-xl font-bold tabular-nums">{memberCount}</p>
        </div>
        <div className="rounded-xl border border-border/70 bg-card/80 px-3 py-2 text-center">
          <p className="text-xs font-semibold text-muted-foreground">Palpites</p>
          <p className="font-heading text-xl font-bold tabular-nums">
            {predictionCount}
            <span className="text-sm font-semibold text-muted-foreground">/{memberCount}</span>
          </p>
        </div>
      </div>

      {missingPredictions > 0 && status === 'predictions_open' ? (
        <p className="mt-3 rounded-xl border border-brand-trophy/30 bg-brand-trophy/10 px-3 py-2 text-sm font-medium">
          Faltam {missingPredictions} palpite(s). Avise antes de iniciar.
        </p>
      ) : null}

      {needsResult ? (
        <p className="mt-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
          Resultado pendente. Salve o placar para pontuar a rodada.
        </p>
      ) : null}

      {primary ? (
        <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <p className="mb-2 flex items-center gap-1 text-xs font-bold uppercase tracking-wide text-primary">
            <ChevronRight className="size-3.5" aria-hidden />
            Próximo passo
          </p>
          <p className="mb-3 text-sm text-muted-foreground">{primary.description}</p>
          <HostActionForm
            action={primary}
            matchId={matchId}
            roomId={roomId}
            roomCode={roomCode}
          />
        </div>
      ) : (
        <p className="mt-3 rounded-xl border border-match-finished/30 bg-match-finished/10 px-3 py-2 text-sm font-medium">
          Partida encerrada. Confira o ranking e escolha o próximo jogo.
        </p>
      )}

      {secondary.length > 0 ? (
        <div className="mt-3 flex flex-col gap-2 border-t border-border/60 pt-3">
          {secondary.map((action) => (
            <HostActionForm
              key={action.nextStatus}
              action={action}
              matchId={matchId}
              roomId={roomId}
              roomCode={roomCode}
              size="sm"
            />
          ))}
        </div>
      ) : null}

      <ol className="mt-3 space-y-1 border-t border-border/60 pt-3">
        {STEPS.map((step) => {
          const isDone = done[step.id]
          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center gap-2 text-xs',
                isDone ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {isDone ? (
                <Check className="size-3.5 shrink-0 text-match-finished" aria-hidden />
              ) : (
                <Circle className="size-3.5 shrink-0" aria-hidden />
              )}
              <span>{step.label}</span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

export { HostGameControl }
