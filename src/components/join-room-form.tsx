'use client'

import { useActionState } from 'react'

import { AvatarPicker } from '@/components/avatar-picker'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { joinRoomAction, type ActionState } from '@/features/rooms/actions'
import { RoomCodeInput } from '@/components/patterns/room-code-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

type JoinRoomFormProps = {
  defaultRoomCode?: string
}

function JoinRoomForm({ defaultRoomCode = '' }: JoinRoomFormProps) {
  const [state, formAction, isPending] = useActionState(joinRoomAction, initialState)

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg shadow-brand-field/5">
      <CardHeader>
        <CardTitle>Entrar na sala</CardTitle>
        <CardDescription>
          Cole o código de 6 letras que veio no link ou no grupo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="flex flex-col gap-5"
          aria-describedby={state.error ? 'join-room-error' : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor="roomCode">Código da sala</Label>
            <RoomCodeInput
              id="roomCode"
              name="roomCode"
              defaultValue={defaultRoomCode}
              maxLength={6}
              minLength={6}
              required
              aria-invalid={state.error ? true : undefined}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Seu nome</Label>
            <Input
              id="displayName"
              name="displayName"
              placeholder="Ex: Ana"
              required
              autoComplete="nickname"
            />
          </div>

          <div className="space-y-2">
            <Label>Seu avatar</Label>
            <AvatarPicker />
          </div>

          {state.error ? (
            <p
              id="join-room-error"
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
              {isPending ? 'Entrando...' : 'Entrar na sala'}
            </Button>
          </StickyFormSubmit>
        </form>
      </CardContent>
    </Card>
  )
}

export { JoinRoomForm }
