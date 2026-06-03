'use client'

import { useActionState } from 'react'

import { FieldError } from '@/components/field-error'
import { submitMatchResultAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { fieldDescribedBy } from '@/lib/form-a11y'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

type MatchResultFormProps = {
  matchId: string
  roomId: string
  roomCode: string
  defaultWinner?: string
  defaultHomeScore?: number
  defaultAwayScore?: number
  defaultPlayer?: string
  winnerSuggestions?: string[]
  playerSuggestions?: string[]
}

function MatchResultForm({
  matchId,
  roomId,
  roomCode,
  defaultWinner = '',
  defaultHomeScore = 0,
  defaultAwayScore = 0,
  defaultPlayer = '',
  winnerSuggestions = [],
  playerSuggestions = [],
}: MatchResultFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitMatchResultAction,
    initialState
  )
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const winnerError = state.fieldErrors?.winner
  const homeScoreError = state.fieldErrors?.homeScore
  const awayScoreError = state.fieldErrors?.awayScore
  const playerError = state.fieldErrors?.playerOfMatch

  const winnerListId = 'winner-suggestions'
  const playerListId = 'player-suggestions'

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/10 to-card">
      <CardHeader>
        <CardTitle>Resultado da partida</CardTitle>
        <CardDescription className="block space-y-2">
          <ul className="grid gap-1" aria-label="Pontuação do resultado">
            <li>+50 vencedor</li>
            <li>+50 craque</li>
            <li>+100 placar exato</li>
          </ul>
          <p>Use sugestões dos palpites para evitar erro de digitação.</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="flex flex-col gap-4"
          aria-describedby={showFormError ? 'match-result-error' : undefined}
        >
          <input type="hidden" name="matchId" value={matchId} />
          <input type="hidden" name="roomId" value={roomId} />
          <input type="hidden" name="roomCode" value={roomCode} />

          <div className="space-y-2">
            <Label htmlFor="winner">Vencedor</Label>
            <p id="match-winner-hint" className="text-xs text-muted-foreground">
              Igual ao placar final
            </p>
            <Input
              id="winner"
              name="winner"
              list={winnerSuggestions.length > 0 ? winnerListId : undefined}
              defaultValue={defaultWinner}
              required
              aria-invalid={winnerError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'match-winner-hint',
                'match-winner-error',
                winnerError
              )}
            />
            {winnerSuggestions.length > 0 ? (
              <datalist id={winnerListId}>
                {winnerSuggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            ) : null}
            <FieldError id="match-winner-error" message={winnerError} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="homeScore">Gols mandante</Label>
              <Input
                id="homeScore"
                name="homeScore"
                type="number"
                min={0}
                defaultValue={defaultHomeScore}
                required
                aria-invalid={homeScoreError ? true : undefined}
                aria-describedby={
                  homeScoreError ? 'match-homeScore-error' : undefined
                }
              />
              <FieldError id="match-homeScore-error" message={homeScoreError} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="awayScore">Gols visitante</Label>
              <Input
                id="awayScore"
                name="awayScore"
                type="number"
                min={0}
                defaultValue={defaultAwayScore}
                required
                aria-invalid={awayScoreError ? true : undefined}
                aria-describedby={
                  awayScoreError ? 'match-awayScore-error' : undefined
                }
              />
              <FieldError id="match-awayScore-error" message={awayScoreError} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerOfMatch">Craque da partida</Label>
            <p id="match-player-hint" className="text-xs text-muted-foreground">
              Nome como nos palpites
            </p>
            <Input
              id="playerOfMatch"
              name="playerOfMatch"
              list={playerSuggestions.length > 0 ? playerListId : undefined}
              defaultValue={defaultPlayer}
              required
              aria-invalid={playerError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'match-player-hint',
                'match-player-error',
                playerError
              )}
            />
            {playerSuggestions.length > 0 ? (
              <datalist id={playerListId}>
                {playerSuggestions.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            ) : null}
            <FieldError id="match-player-error" message={playerError} />
          </div>

          {showFormError ? (
            <p
              id="match-result-error"
              className="text-sm font-medium text-destructive"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <StickyFormSubmit>
            <Button
              type="submit"
              variant="success"
              className="min-h-12 w-full"
              disabled={isPending}
            >
              {isPending ? 'Calculando pontos...' : 'Salvar resultado e pontuar'}
            </Button>
          </StickyFormSubmit>
        </form>
      </CardContent>
    </Card>
  )
}

export { MatchResultForm }
