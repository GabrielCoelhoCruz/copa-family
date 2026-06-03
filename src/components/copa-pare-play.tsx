'use client'

import { useActionState, useState } from 'react'
import { PartyPopper } from 'lucide-react'

import { FieldError } from '@/components/field-error'
import { submitCopaPareAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { CopaPareTimer } from '@/components/patterns/copa-pare-timer'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { fieldDescribedBy } from '@/lib/form-a11y'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { pickCopaPareCategory } from '@/lib/copa-pare-categories'
import { getRemainingSeconds, useNowMs } from '@/lib/second-ticker'
import { cn } from '@/lib/utils'

const initialState: ActionState = {}

const TOTAL_SECONDS = 30

type CopaParePlayProps = {
  matchId: string
  roomId: string
  roomCode: string
  seed: string
}

function CopaParePlay({ matchId, roomId, roomCode, seed }: CopaParePlayProps) {
  const category = pickCopaPareCategory(seed)
  const [deadlineMs] = useState(() => Date.now() + TOTAL_SECONDS * 1000)
  const nowMs = useNowMs()
  const remainingSeconds = getRemainingSeconds(deadlineMs, nowMs, TOTAL_SECONDS)
  const [state, formAction, isPending] = useActionState(submitCopaPareAction, initialState)

  const isExpired = remainingSeconds <= 0
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const answerError = state.fieldErrors?.answer

  return (
    <div className="flex flex-col gap-4">
      <CopaPareTimer
        remainingSeconds={remainingSeconds}
        totalSeconds={TOTAL_SECONDS}
        categories={[category.label]}
      />

      <Card
        className={cn(
          'cf-animate-in border-brand-party/35 bg-gradient-to-br from-brand-party/15 to-card shadow-lg shadow-brand-party/10',
          isExpired && 'opacity-80'
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="size-5 text-brand-party" aria-hidden />
            Sua rodada
          </CardTitle>
          <CardDescription>
            Categoria sorteada: <strong className="text-foreground">{category.label}</strong>.
            Responda rápido para ganhar +100 pts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={formAction}
            className="flex flex-col gap-4"
            aria-describedby={showFormError ? 'copa-pare-error' : undefined}
          >
            <input type="hidden" name="matchId" value={matchId} />
            <input type="hidden" name="roomId" value={roomId} />
            <input type="hidden" name="roomCode" value={roomCode} />
            <input type="hidden" name="category" value={category.value} />

            <div className="space-y-2">
              <Label htmlFor="answer">Sua resposta</Label>
              <p id="copa-pare-answer-hint" className="text-xs text-muted-foreground">
                {category.placeholder}
              </p>
              <Input
                id="answer"
                name="answer"
                className="min-h-12 text-base"
                required
                disabled={isExpired || isPending}
                autoComplete="off"
                aria-invalid={answerError ? true : undefined}
                aria-describedby={fieldDescribedBy(
                  'copa-pare-answer-hint',
                  'copa-pare-answer-error',
                  answerError
                )}
              />
              <FieldError id="copa-pare-answer-error" message={answerError} />
            </div>

            {isExpired ? (
              <p className="text-sm font-medium text-destructive" role="alert">
                Tempo esgotado. Peça ao anfitrião para abrir outro intervalo na próxima
                partida.
              </p>
            ) : null}

            {showFormError ? (
              <p
                id="copa-pare-error"
                className="text-sm font-medium text-destructive"
                role="alert"
              >
                {state.error}
              </p>
            ) : null}

            <StickyFormSubmit withSalaNav>
              <Button
                type="submit"
                variant="party"
                className="cf-pressable min-h-12 w-full"
                disabled={isPending || isExpired}
              >
                {isPending ? 'Enviando...' : 'Confirmar Copa Pare (+100 pts)'}
              </Button>
            </StickyFormSubmit>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export { CopaParePlay }
