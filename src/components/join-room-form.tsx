'use client'

import { useActionState } from 'react'

import { AvatarPicker } from '@/components/avatar-picker'
import { FieldError } from '@/components/field-error'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { joinRoomAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { fieldDescribedBy } from '@/lib/form-a11y'
import { RoomCodeInput } from '@/components/patterns/room-code-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

type JoinRoomFormProps = {
  defaultRoomCode?: string
}

function JoinRoomForm({ defaultRoomCode = '' }: JoinRoomFormProps) {
  const [state, formAction, isPending] = useActionState(joinRoomAction, initialState)
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const roomCodeError = state.fieldErrors?.roomCode
  const displayNameError = state.fieldErrors?.displayName
  const avatarError = state.fieldErrors?.avatarKey

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg shadow-brand-field/5">
      <CardContent className="pt-4">
        <form
          action={formAction}
          className="flex flex-col gap-5"
          aria-describedby={showFormError ? 'join-room-error' : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor="roomCode">Código da sala</Label>
            <p id="roomCode-hint" className="text-xs text-muted-foreground">
              6 letras, sem espaços
            </p>
            <RoomCodeInput
              id="roomCode"
              name="roomCode"
              defaultValue={defaultRoomCode}
              maxLength={6}
              minLength={6}
              required
              aria-invalid={roomCodeError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'roomCode-hint',
                'roomCode-error',
                roomCodeError
              )}
            />
            <FieldError id="roomCode-error" message={roomCodeError} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Seu nome</Label>
            <p id="displayName-hint" className="text-xs text-muted-foreground">
              Como aparece no ranking
            </p>
            <Input
              id="displayName"
              name="displayName"
              required
              autoComplete="nickname"
              aria-invalid={displayNameError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'displayName-hint',
                'displayName-error',
                displayNameError
              )}
            />
            <FieldError id="displayName-error" message={displayNameError} />
          </div>

          <div className="space-y-2">
            <Label id="avatar-label">Seu avatar</Label>
            <p id="avatar-hint" className="text-xs text-muted-foreground">
              Escolha um para a sala
            </p>
            <AvatarPicker
              aria-labelledby="avatar-label"
              aria-describedby={
                avatarError ? 'avatar-hint avatar-error' : 'avatar-hint'
              }
              aria-invalid={avatarError ? true : undefined}
            />
            <FieldError id="avatar-error" message={avatarError} />
          </div>

          {showFormError ? (
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
