'use client'

import { useActionState } from 'react'

import { PredictionCard } from '@/components/patterns/prediction-card'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { submitPredictionAction, type ActionState } from '@/features/rooms/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

type PredictionFormProps = {
  matchId: string
  roomId: string
  roomCode: string
  userId: string
}

function PredictionForm({ matchId, roomId, roomCode, userId }: PredictionFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitPredictionAction,
    initialState
  )

  return (
    <PredictionCard
      title="Seu palpite"
      description="Preencha antes do apito inicial. Vale +10 pontos."
      state="open"
    >
      <form
        action={formAction}
        className="flex flex-col gap-4"
        aria-describedby={state.error ? 'prediction-error' : undefined}
      >
        <input type="hidden" name="matchId" value={matchId} />
        <input type="hidden" name="roomId" value={roomId} />
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="roomCode" value={roomCode} />

        <div className="space-y-2">
          <Label htmlFor="winner">Vencedor</Label>
          <Input
            id="winner"
            name="winner"
            placeholder="Ex: Brasil"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="homeScore">Gols do mandante</Label>
            <Input
              id="homeScore"
              name="homeScore"
              type="number"
              min={0}
              defaultValue={0}
              suppressHydrationWarning
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awayScore">Gols do visitante</Label>
            <Input
              id="awayScore"
              name="awayScore"
              type="number"
              min={0}
              defaultValue={0}
              suppressHydrationWarning
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="playerOfMatch">Craque da partida</Label>
          <Input
            id="playerOfMatch"
            name="playerOfMatch"
            placeholder="Ex: Neymar"
            required
          />
        </div>

        {state.error ? (
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
