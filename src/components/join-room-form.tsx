'use client'

import { useActionState, useState } from 'react'
import { Check } from 'lucide-react'

import { FieldError } from '@/components/field-error'
import { PlayerAvatarPicker } from '@/components/player-avatar-picker'
import { StadiumInput } from '@/components/patterns/stadium-input'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { joinRoomAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import type { SelectablePlayer } from '@/features/players/types'
import { fieldDescribedBy } from '@/lib/form-a11y'
import { Button } from '@/components/ui/button'

const initialState: ActionState = {}

type JoinRoomFormProps = {
  defaultRoomCode?: string
  players: SelectablePlayer[]
}

function JoinRoomForm({ defaultRoomCode = '', players }: JoinRoomFormProps) {
  const [state, formAction, isPending] = useActionState(joinRoomAction, initialState)
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const roomCodeError = state.fieldErrors?.roomCode
  const displayNameError = state.fieldErrors?.displayName
  const avatarError = state.fieldErrors?.avatarPlayerId
  const [avatarPlayerId, setAvatarPlayerId] = useState<string | null>(null)
  const canSubmit = players.length > 0 && avatarPlayerId != null

  return (
    <form
      action={formAction}
      className="flex min-h-0 flex-1 flex-col"
      aria-describedby={showFormError ? 'join-room-error' : undefined}
    >
      <div className="flex flex-1 flex-col gap-5 pb-4">
        <StadiumLabel>Seu nome e avatar</StadiumLabel>
        <PlayerAvatarPicker
          players={players}
          onSelectedChange={setAvatarPlayerId}
          aria-labelledby="join-avatar-label"
          aria-describedby={
            avatarError ? 'join-avatar-hint join-avatar-error' : 'join-avatar-hint'
          }
          aria-invalid={avatarError ? true : undefined}
        />
        <span id="join-avatar-label" className="sr-only">
          Seu jogador
        </span>
        <FieldError id="join-avatar-error" message={avatarError} />
        <StadiumInput
          id="displayName"
          name="displayName"
          required
          placeholder="Seu nome"
          autoComplete="nickname"
          hasError={Boolean(displayNameError)}
          aria-invalid={displayNameError ? true : undefined}
          aria-describedby={fieldDescribedBy(
            'displayName-hint',
            'displayName-error',
            displayNameError
          )}
        />
        <FieldError id="displayName-error" message={displayNameError} />

        <StadiumLabel>Código da sala</StadiumLabel>
        <StadiumInput
          id="roomCode"
          name="roomCode"
          defaultValue={defaultRoomCode}
          maxLength={6}
          minLength={6}
          required
          placeholder="COPA-XXXX"
          className="font-mono uppercase tracking-widest"
          hasError={Boolean(roomCodeError)}
          aria-invalid={roomCodeError ? true : undefined}
          aria-describedby={fieldDescribedBy(
            'roomCode-hint',
            'roomCode-error',
            roomCodeError
          )}
        />
        <FieldError id="roomCode-error" message={roomCodeError} />

        {showFormError ? (
          <p
            id="join-room-error"
            className="text-sm font-semibold text-[var(--cf-coral)]"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}
      </div>

      <StickyFormSubmit className="cf-sticky-footer -mx-[var(--site-page-px)] px-[var(--site-page-px)] pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <Button
          type="submit"
          variant="stadium"
          className="w-full"
          disabled={isPending || !canSubmit}
        >
          <Check className="size-[19px]" aria-hidden />
          {isPending ? 'Entrando...' : 'Entrar na sala'}
        </Button>
      </StickyFormSubmit>
    </form>
  )
}

export { JoinRoomForm }
