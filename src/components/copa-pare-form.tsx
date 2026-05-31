'use client'

import { useActionState } from 'react'

import { submitCopaPareAction, type ActionState } from '@/features/rooms/actions'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

const CATEGORIES = [
  { value: 'player', label: 'Jogador' },
  { value: 'team', label: 'Seleção' },
  { value: 'coach', label: 'Técnico' },
  { value: 'stadium', label: 'Estádio' },
] as const

type CopaPareFormProps = {
  matchId: string
  roomId: string
  roomCode: string
  userId: string
}

function CopaPareForm({ matchId, roomId, roomCode, userId }: CopaPareFormProps) {
  const [state, formAction, isPending] = useActionState(submitCopaPareAction, initialState)

  return (
    <Card className="border-brand-party/30 bg-gradient-to-br from-brand-party/10 to-card">
      <CardHeader>
        <CardTitle>Copa Pare</CardTitle>
        <CardDescription>
          Escolha uma categoria e responda em 30 segundos (no intervalo). +100 pts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="matchId" value={matchId} />
          <input type="hidden" name="roomId" value={roomId} />
          <input type="hidden" name="roomCode" value={roomCode} />
          <input type="hidden" name="userId" value={userId} />

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              name="category"
              required
              className="h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base"
              defaultValue="player"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="answer">Sua resposta</Label>
            <Input id="answer" name="answer" placeholder="Ex: Neymar" required />
          </div>

          {state.error ? (
            <p className="text-sm font-medium text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}

          <StickyFormSubmit withSalaNav>
            <Button
              type="submit"
              variant="party"
              className="min-h-12 w-full"
              disabled={isPending}
            >
              {isPending ? 'Enviando...' : 'Enviar Copa Pare (+100 pts)'}
            </Button>
          </StickyFormSubmit>
        </form>
      </CardContent>
    </Card>
  )
}

export { CopaPareForm }
