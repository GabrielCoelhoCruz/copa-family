'use client'

import { useActionState } from 'react'

import { AvatarPicker } from '@/components/avatar-picker'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { createRoomAction, type ActionState } from '@/features/rooms/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

function CreateRoomForm() {
  const [state, formAction, isPending] = useActionState(createRoomAction, initialState)

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg shadow-brand-field/5">
      <CardHeader>
        <CardTitle>Criar sala</CardTitle>
        <CardDescription>
          Em menos de um minuto você cria a sala e manda o link no grupo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="flex flex-col gap-5"
          aria-describedby={state.error ? 'create-room-error' : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor="displayName">Seu nome</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="Ex: Gabriel"
              required
              autoComplete="nickname"
            />
          </div>

          <div className="space-y-2">
            <Label>Seu avatar</Label>
            <AvatarPicker />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomName">Nome da sala</Label>
            <Input
              id="roomName"
              name="roomName"
              placeholder="Ex: Família Coelho"
              required
            />
          </div>

          {state.error ? (
            <p
              id="create-room-error"
              className="text-sm font-medium text-destructive"
              role="alert"
            >
              {state.error}
            </p>
          ) : null}

          <StickyFormSubmit>
            <Button
              type="submit"
              variant="party"
              size="lg"
              className="min-h-12 w-full"
              disabled={isPending}
            >
              {isPending ? 'Criando...' : 'Criar sala'}
            </Button>
          </StickyFormSubmit>
        </form>
      </CardContent>
    </Card>
  )
}

export { CreateRoomForm }
