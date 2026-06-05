'use client'

import { useActionState, useMemo, useState } from 'react'
import { CheckCircle } from 'lucide-react'

import { FieldError } from '@/components/field-error'
import { CopaPareTimer } from '@/components/patterns/copa-pare-timer'
import { StadiumInput } from '@/components/patterns/stadium-input'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { submitCopaPareAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { fieldDescribedBy } from '@/lib/form-a11y'
import {
  answerStartsWithLetter,
  type CopaPareCategoryValue,
  getCopaPareCategoryByValue,
} from '@/lib/copa-pare-categories'
import {
  COPA_PARE_ROUND_SECONDS,
  getCopaPareRoundDeadlineMs,
} from '@/lib/copa-pare-interval'
import { getRemainingSeconds, useNowMs } from '@/lib/second-ticker'
import { Button } from '@/components/ui/button'

const initialState: ActionState = {}

type CopaParePlayProps = {
  matchId: string
  roomId: string
  roomCode: string
  categoryValue: CopaPareCategoryValue
  letter: string
  halftimeStartedAt: string | null
}

function CopaParePlay({
  matchId,
  roomId,
  roomCode,
  categoryValue,
  letter,
  halftimeStartedAt,
}: CopaParePlayProps) {
  const category = getCopaPareCategoryByValue(categoryValue)
  const deadlineMs = useMemo(() => {
    const fromServer = getCopaPareRoundDeadlineMs(halftimeStartedAt)
    return fromServer ?? Date.now() + COPA_PARE_ROUND_SECONDS * 1000
  }, [halftimeStartedAt])
  const nowMs = useNowMs()
  const remainingSeconds = getRemainingSeconds(
    deadlineMs,
    nowMs,
    COPA_PARE_ROUND_SECONDS
  )
  const [state, formAction, isPending] = useActionState(submitCopaPareAction, initialState)
  const [answer, setAnswer] = useState('')

  const isExpired = remainingSeconds <= 0
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const answerError = state.fieldErrors?.answer

  const letterHintInvalid = useMemo(() => {
    if (!answer.trim()) return false
    return !answerStartsWithLetter(answer, letter)
  }, [answer, letter])

  if (!category) {
    return (
      <p className="text-sm font-semibold text-[var(--cf-coral)]" role="alert">
        Rodada do intervalo ainda não foi configurada. Peça ao anfitrião para abrir o
        intervalo.
      </p>
    )
  }

  return (
    <form
      action={formAction}
      className="flex min-h-0 flex-1 flex-col gap-0"
      aria-describedby={showFormError ? 'copa-pare-error' : undefined}
    >
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="roomCode" value={roomCode} />

      <div className="flex flex-1 flex-col gap-5 pb-4">
        <CopaPareTimer
          remainingSeconds={remainingSeconds}
          totalSeconds={COPA_PARE_ROUND_SECONDS}
          categoryLabel={category.label}
          letter={letter}
        />

        <StadiumLabel>Sua resposta</StadiumLabel>
        <p className="-mt-2 text-xs text-[var(--cf-muted)]">
          Comece com <strong className="text-white">{letter}</strong> ·{' '}
          {category.label}
        </p>
        <StadiumInput
          id="answer"
          name="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={category.placeholder}
          disabled={isExpired || isPending}
          autoComplete="off"
          hasError={Boolean(answerError) || letterHintInvalid}
          aria-invalid={answerError || letterHintInvalid ? true : undefined}
          aria-describedby={fieldDescribedBy(
            'copa-pare-answer-hint',
            'copa-pare-answer-error',
            answerError
          )}
        />
        <p id="copa-pare-answer-hint" className="sr-only">
          {category.placeholder}
        </p>
        {letterHintInvalid && !answerError ? (
          <p className="text-xs font-semibold text-[var(--cf-coral)]" role="alert">
            A resposta precisa começar com a letra {letter}.
          </p>
        ) : null}
        <FieldError id="copa-pare-answer-error" message={answerError} />

        {isExpired ? (
          <p className="text-sm font-semibold text-[var(--cf-coral)]" role="alert">
            Tempo esgotado. Peça ao anfitrião para sortear outra letra ou retomar o
            jogo.
          </p>
        ) : null}

        {showFormError ? (
          <p
            id="copa-pare-error"
            className="text-sm font-semibold text-[var(--cf-coral)]"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
      </div>

      <StickyFormSubmit withSalaNav>
        <Button
          type="submit"
          variant="stadium-coral"
          className="w-full gap-2"
          disabled={
            isPending ||
            isExpired ||
            !answer.trim() ||
            letterHintInvalid
          }
        >
          <CheckCircle className="size-[19px]" aria-hidden />
          {isPending ? 'Enviando...' : 'Confirmar Copa Stop · +50'}
        </Button>
      </StickyFormSubmit>
    </form>
  )
}

export { CopaParePlay }
