'use client'

import { useActionState, useState } from 'react'
import { CheckCircle, Clock } from 'lucide-react'

import { FieldError } from '@/components/field-error'
import { ScoreStepper } from '@/components/patterns/score-stepper'
import { StadiumCard } from '@/components/patterns/stadium-card'
import { StadiumFlag } from '@/components/patterns/stadium-flag'
import { StadiumInput } from '@/components/patterns/stadium-input'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { submitPredictionAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { fieldDescribedBy } from '@/lib/form-a11y'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { famousPlayersForFixture } from '@/features/fixtures/team-famous-players'
import { Button } from '@/components/ui/button'
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

  const [homeScore, setHomeScore] = useState(2)
  const [awayScore, setAwayScore] = useState(1)
  const [winner, setWinner] = useState<string>(
    fixture?.home_team_name ?? ''
  )
  const [player, setPlayer] = useState('')

  const winnerOptions = fixture
    ? [
        { key: 'home', label: fixture.home_team_name },
        { key: 'draw', label: 'Empate' },
        { key: 'away', label: fixture.away_team_name },
      ]
    : []

  const playerOptions = fixture
    ? famousPlayersForFixture(fixture.home_team_name, fixture.away_team_name)
    : []

  function pickWinner(option: (typeof winnerOptions)[number]) {
    setWinner(option.label)
    if (option.key === 'home' && homeScore <= awayScore) setHomeScore(awayScore + 1)
    else if (option.key === 'away' && awayScore <= homeScore) setAwayScore(homeScore + 1)
    else if (option.key === 'draw' && homeScore !== awayScore) {
      const m = Math.max(homeScore, awayScore)
      setHomeScore(m)
      setAwayScore(m)
    }
  }

  return (
    <form
      action={formAction}
      className="flex min-h-0 flex-1 flex-col gap-0"
      aria-describedby={showFormError ? 'prediction-error' : undefined}
    >
      <input type="hidden" name="matchId" value={matchId} />
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="roomCode" value={roomCode} />
      <input type="hidden" name="homeScore" value={homeScore} />
      <input type="hidden" name="awayScore" value={awayScore} />
      <input type="hidden" name="winner" value={winner} />

      <div className="flex flex-1 flex-col gap-5 pb-4">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--cf-card-border-soft)] bg-[var(--cf-glass)] px-3 py-1.5 text-xs text-[var(--cf-muted)]">
            <Clock className="size-3.5 text-[var(--cf-gold)]" aria-hidden />
            Fecha em <strong className="text-white">12:34</strong>
          </span>
        </div>

        <StadiumLabel>Quem vence?</StadiumLabel>
        {fixture ? (
          <div
            className="grid grid-cols-3 gap-2"
            role="radiogroup"
            aria-labelledby="prediction-winner-label"
          >
            <span id="prediction-winner-label" className="sr-only">
              Vencedor
            </span>
            {winnerOptions.map((option) => {
              const on = winner === option.label
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => pickWinner(option)}
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-[15px] border-[1.5px] px-1.5 py-2.5',
                    on
                      ? 'border-[var(--cf-gold)] bg-[rgba(230,197,119,0.14)]'
                      : 'border-[var(--cf-card-border)] bg-[var(--cf-glass)]'
                  )}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center">
                    {option.key !== 'draw' ? (
                      <StadiumFlag teamName={option.label} size={28} round />
                    ) : (
                      <div className="flex size-7 items-center justify-center rounded-full bg-white/8 text-xs font-extrabold text-[var(--cf-muted)]">
                        =
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      'flex min-h-7 w-full items-center justify-center text-center text-[11px] leading-tight font-bold text-pretty',
                      on ? 'text-white' : 'text-[var(--cf-muted)]'
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        ) : null}
        <FieldError id="prediction-winner-error" message={winnerError} />

        <StadiumLabel>Placar</StadiumLabel>
        {fixture ? (
          <StadiumCard glass pad={16}>
            <div className="flex items-center">
              <ScoreStepper
                teamName={fixture.home_team_name}
                value={homeScore}
                onChange={(v) => {
                  setHomeScore(v)
                  if (v > awayScore) setWinner(fixture.home_team_name)
                  else if (v < awayScore) setWinner(fixture.away_team_name)
                  else setWinner('Empate')
                }}
              />
              <div className="px-1 pt-8 font-heading text-[26px] font-extrabold text-[var(--cf-faint)]">
                ×
              </div>
              <ScoreStepper
                teamName={fixture.away_team_name}
                value={awayScore}
                onChange={(v) => {
                  setAwayScore(v)
                  if (v > homeScore) setWinner(fixture.away_team_name)
                  else if (v < homeScore) setWinner(fixture.home_team_name)
                  else setWinner('Empate')
                }}
              />
            </div>
          </StadiumCard>
        ) : null}
        <FieldError id="prediction-homeScore-error" message={homeScoreError} />
        <FieldError id="prediction-awayScore-error" message={awayScoreError} />

        <StadiumLabel>
          Craque da partida{' '}
          <span className="normal-case font-semibold text-[var(--cf-faint)]">· +50</span>
        </StadiumLabel>
        {playerOptions.length > 0 ? (
          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-labelledby="prediction-player-label"
            aria-invalid={playerError ? true : undefined}
          >
            <span id="prediction-player-label" className="sr-only">
              Craque da partida
            </span>
            {playerOptions.map((name) => {
              const on = player === name
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setPlayer(on ? '' : name)}
                  className={cn('cf-picker-chip', on && 'cf-picker-chip--selected')}
                >
                  {name}
                </button>
              )
            })}
          </div>
        ) : (
          <StadiumInput
            id="playerOfMatch"
            value={player}
            onChange={(e) => setPlayer(e.target.value)}
            placeholder="Nome do jogador"
            hasError={Boolean(playerError)}
            aria-invalid={playerError ? true : undefined}
          />
        )}
        <input type="hidden" id="playerOfMatch" name="playerOfMatch" value={player} />
        <FieldError id="prediction-player-error" message={playerError} />

        {showFormError ? (
          <p
            id="prediction-error"
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
          variant="stadium"
          className="w-full gap-2"
          disabled={isPending || !winner || !player.trim()}
        >
          <CheckCircle className="size-[19px]" aria-hidden />
          {isPending ? 'Salvando...' : 'Salvar palpite · +10 pts'}
        </Button>
      </StickyFormSubmit>
    </form>
  )
}

export { PredictionForm }
