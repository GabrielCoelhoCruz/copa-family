'use client'

import { useActionState, useMemo, useState } from 'react'
import { Trophy } from 'lucide-react'

import { FieldError } from '@/components/field-error'
import { PlayerAvatarPicker } from '@/components/player-avatar-picker'
import { FixturePickerCompact } from '@/components/patterns/fixture-picker-compact'
import { StadiumInput } from '@/components/patterns/stadium-input'
import { StadiumLabel } from '@/components/patterns/stadium-label'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { createRoomAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import type { SelectablePlayer } from '@/features/players/types'
import { fieldDescribedBy } from '@/lib/form-a11y'
import { Button } from '@/components/ui/button'

const initialState: ActionState = {}

type CreateRoomFormProps = {
  fixtures: CatalogFixtureView[]
  players: SelectablePlayer[]
  defaultFixtureId?: string
}

function CreateRoomForm({ fixtures, players, defaultFixtureId }: CreateRoomFormProps) {
  const [state, formAction, isPending] = useActionState(createRoomAction, initialState)
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const displayNameError = state.fieldErrors?.displayName
  const avatarError = state.fieldErrors?.avatarPlayerId
  const roomNameError = state.fieldErrors?.roomName
  const fixtureIdError = state.fieldErrors?.fixtureId
  const [avatarPlayerId, setAvatarPlayerId] = useState<string | null>(null)
  const todaysFixtures = useMemo(() => fixtures.slice(0, 4), [fixtures])
  const [fixtureId, setFixtureId] = useState(
    defaultFixtureId ?? todaysFixtures[0]?.id ?? ''
  )
  const canSubmit =
    players.length > 0 && avatarPlayerId != null && Boolean(fixtureId)

  return (
    <form
      action={formAction}
      className="flex min-h-0 flex-1 flex-col"
      aria-describedby={showFormError ? 'create-room-error' : undefined}
    >
      <div className="flex flex-1 flex-col gap-5 pb-4">
        <StadiumLabel>Seu nome e avatar</StadiumLabel>
        <PlayerAvatarPicker
          players={players}
          onSelectedChange={setAvatarPlayerId}
          aria-labelledby="create-avatar-label"
          aria-describedby={
            avatarError ? 'create-avatar-hint create-avatar-error' : 'create-avatar-hint'
          }
          aria-invalid={avatarError ? true : undefined}
        />
        <span id="create-avatar-label" className="sr-only">
          Seu jogador
        </span>
        <p id="create-avatar-hint" className="sr-only">
          Escolha o jogador do seu avatar
        </p>
        <FieldError id="create-avatar-error" message={avatarError} />
        <StadiumInput
          id="displayName"
          name="displayName"
          required
          placeholder="Seu nome"
          autoComplete="nickname"
          hasError={Boolean(displayNameError)}
          aria-invalid={displayNameError ? true : undefined}
          aria-describedby={fieldDescribedBy(
            'create-displayName-hint',
            'create-displayName-error',
            displayNameError
          )}
        />
        <FieldError id="create-displayName-error" message={displayNameError} />

        <StadiumLabel>Nome da sala</StadiumLabel>
        <StadiumInput
          id="roomName"
          name="roomName"
          required
          placeholder="Nome da sala"
          defaultValue="Família Coelho"
          hasError={Boolean(roomNameError)}
          aria-invalid={roomNameError ? true : undefined}
          aria-describedby={fieldDescribedBy(
            'roomName-hint',
            'roomName-error',
            roomNameError
          )}
        />
        <FieldError id="roomName-error" message={roomNameError} />

        <StadiumLabel>Jogos do dia</StadiumLabel>
        {todaysFixtures.length > 0 ? (
          <FixturePickerCompact
            fixtures={todaysFixtures}
            selectedId={fixtureId}
            onSelect={setFixtureId}
          />
        ) : (
          <p className="text-sm text-[var(--cf-muted)]">
            Sincronize o calendário no servidor para escolher um jogo.
          </p>
        )}
        <input type="hidden" name="fixtureId" value={fixtureId} />
        <FieldError id="create-fixture-error" message={fixtureIdError} />

        {showFormError ? (
          <p
            id="create-room-error"
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
          <Trophy className="size-[19px]" aria-hidden />
          {isPending ? 'Criando...' : 'Criar sala'}
        </Button>
      </StickyFormSubmit>
    </form>
  )
}

export { CreateRoomForm }
