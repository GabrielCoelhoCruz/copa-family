'use client'

import { useActionState } from 'react'

import { FieldError } from '@/components/field-error'
import { PredictionCard } from '@/components/patterns/prediction-card'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { submitPredictionAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { fieldDescribedBy } from '@/lib/form-a11y'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const initialState: ActionState = {}

type PredictionFormProps = {
  matchId: string
  roomId: string
  roomCode: string
  fixture?: CatalogFixtureView | null
}

function PredictionForm({
  matchId,
  roomId,
  roomCode,
  fixture = null,
}: PredictionFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitPredictionAction,
    initialState
  )
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const winnerError = state.fieldErrors?.winner
  const homeScoreError = state.fieldErrors?.homeScore
  const awayScoreError = state.fieldErrors?.awayScore
  const playerError = state.fieldErrors?.playerOfMatch

  const homeLabel = fixture?.home_team_name ?? 'Gols do mandante'
  const awayLabel = fixture?.away_team_name ?? 'Gols do visitante'

  return (
    <PredictionCard
      title="Seu palpite"
      description={
        fixture
          ? `${fixture.home_team_name} x ${fixture.away_team_name} — antes do apito. +10 pontos.`
          : 'Preencha antes do apito inicial. Vale +10 pontos.'
      }
      state="open"
    >
      <ol className="mb-1 flex gap-1.5" aria-label="Progresso do palpite">
        {['Vencedor', 'Placar', 'Craque'].map((step, index) => (
          <li
            key={step}
            className="h-1.5 flex-1 rounded-full bg-brand-sky/25"
            title={step}
            style={{ opacity: 0.55 + index * 0.2 }}
          />
        ))}
      </ol>
      <form
        action={formAction}
        className="flex flex-col gap-4"
        aria-describedby={showFormError ? 'prediction-error' : undefined}
      >
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="roomCode" value={roomCode} />

        <div className="space-y-2">
          <Label id="prediction-winner-label">Vencedor</Label>
          <p id="prediction-winner-hint" className="text-xs text-muted-foreground">
            Time que você acha que ganha
          </p>
          {fixture ? (
            <div
              className="flex flex-col gap-2"
              role="radiogroup"
              aria-labelledby="prediction-winner-label"
              aria-describedby={fieldDescribedBy(
                'prediction-winner-hint',
                'prediction-winner-error',
                winnerError
              )}
            >
              {[fixture.home_team_name, fixture.away_team_name, 'Empate'].map(
                (option) => {
                  const id = `winner-${option.replace(/\s+/g, '-')}`
                  return (
                    <label
                      key={option}
                      htmlFor={id}
                      className={cn(
                        'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border px-3',
                        'has-[:checked]:border-brand-field/50 has-[:checked]:bg-brand-field/10'
                      )}
                    >
                      <input
                        type="radio"
                        id={id}
                        name="winner"
                        value={option}
                        required
                        className="size-4 accent-[var(--brand-field)]"
                      />
                      <span className="font-semibold">{option}</span>
                    </label>
                  )
                }
              )}
            </div>
          ) : (
            <Input
              id="winner"
              name="winner"
              className="min-h-12 text-base"
              required
              aria-invalid={winnerError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'prediction-winner-hint',
                'prediction-winner-error',
                winnerError
              )}
            />
          )}
          <FieldError id="prediction-winner-error" message={winnerError} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="homeScore">{homeLabel}</Label>
            <Input
              id="homeScore"
              name="homeScore"
              type="number"
              min={0}
              defaultValue={0}
              className="min-h-12 text-center font-heading text-lg font-bold tabular-nums"
              suppressHydrationWarning
              required
              aria-invalid={homeScoreError ? true : undefined}
              aria-describedby={
                homeScoreError ? 'prediction-homeScore-error' : undefined
              }
            />
            <FieldError id="prediction-homeScore-error" message={homeScoreError} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore">{awayLabel}</Label>
            <Input
              id="awayScore"
              name="awayScore"
              type="number"
              min={0}
              defaultValue={0}
              className="min-h-12 text-center font-heading text-lg font-bold tabular-nums"
              suppressHydrationWarning
              required
              aria-invalid={awayScoreError ? true : undefined}
              aria-describedby={
                awayScoreError ? 'prediction-awayScore-error' : undefined
              }
            />
            <FieldError id="prediction-awayScore-error" message={awayScoreError} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerOfMatch">Craque da partida</Label>
          <p id="prediction-player-hint" className="text-xs text-muted-foreground">
            Jogador destaque da partida
          </p>
          <Input
            id="playerOfMatch"
            name="playerOfMatch"
            className="min-h-12 text-base"
            required
            aria-invalid={playerError ? true : undefined}
            aria-describedby={fieldDescribedBy(
              'prediction-player-hint',
              'prediction-player-error',
              playerError
            )}
          />
          <FieldError id="prediction-player-error" message={playerError} />
        </div>

        {showFormError ? (
          <p
            id="prediction-error"
            className="text-sm font-medium text-destructive"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        <StickyFormSubmit withSalaNav>
          <Button
            type="submit"
            variant="celebrate"
            className="min-h-12 w-full"
            disabled={isPending}
          >
            {isPending ? 'Salvando...' : 'Salvar palpite (+10 pts)'}
          </Button>
        </StickyFormSubmit>
      </form>
    </PredictionCard>
  )
}

export { PredictionForm }
