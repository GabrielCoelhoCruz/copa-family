'use client'

import { useActionState } from 'react'

import { submitMatchResultAction, type ActionState } from '@/features/rooms/actions'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
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
}

function MatchResultForm({
  matchId,
  roomId,
  roomCode,
  defaultWinner = '',
  defaultHomeScore = 0,
  defaultAwayScore = 0,
  defaultPlayer = '',
}: MatchResultFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitMatchResultAction,
    initialState
  )

  return (
    <Card className="border-primary/25 bg-gradient-to-br from-primary/10 to-card">
      <CardHeader>
        <CardTitle>Resultado da partida</CardTitle>
        <CardDescription>
          Vencedor +50 · Craque +50 · Placar exato +100. Pontos recalculados ao salvar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="matchId" value={matchId} />
          <input type="hidden" name="roomId" value={roomId} />
          <input type="hidden" name="roomCode" value={roomCode} />

          <div className="space-y-2">
            <Label htmlFor="winner">Vencedor</Label>
            <Input id="winner" name="winner" defaultValue={defaultWinner} required />
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
              />
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="playerOfMatch">Craque da partida</Label>
            <Input
              id="playerOfMatch"
              name="playerOfMatch"
              defaultValue={defaultPlayer}
              required
            />
          </div>

          {state.error ? (
            <p className="text-sm font-medium text-destructive" role="alert">
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
