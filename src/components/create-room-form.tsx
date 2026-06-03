'use client'

import { useActionState } from 'react'

import { AvatarPicker } from '@/components/avatar-picker'
import { FieldError } from '@/components/field-error'
import { FixturePicker } from '@/components/patterns/fixture-picker'
import { StickyFormSubmit } from '@/components/sticky-form-submit'
import { createRoomAction, type ActionState } from '@/features/rooms/actions'
import { hasFieldErrors } from '@/features/rooms/action-state'
import { fieldDescribedBy } from '@/lib/form-a11y'
import type { CatalogFixtureView } from '@/features/fixtures/catalog-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const initialState: ActionState = {}

type CreateRoomFormProps = {
  fixtures: CatalogFixtureView[]
  defaultFixtureId?: string
}

function CreateRoomForm({ fixtures, defaultFixtureId }: CreateRoomFormProps) {
  const [state, formAction, isPending] = useActionState(createRoomAction, initialState)
  const showFormError = Boolean(state.error && !hasFieldErrors(state))
  const displayNameError = state.fieldErrors?.displayName
  const avatarError = state.fieldErrors?.avatarKey
  const roomNameError = state.fieldErrors?.roomName
  const fixtureIdError = state.fieldErrors?.fixtureId

  return (
    <Card className="border-border/80 bg-card/95 shadow-lg shadow-brand-field/5">
      <CardContent className="pt-4">
        <form
          action={formAction}
          className="flex flex-col gap-5"
          aria-describedby={showFormError ? 'create-room-error' : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor="displayName">Seu nome</Label>
            <p id="create-displayName-hint" className="text-xs text-muted-foreground">
              Como aparece no ranking
            </p>
            <Input
              id="displayName"
              name="displayName"
              required
              autoComplete="nickname"
              aria-invalid={displayNameError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'create-displayName-hint',
                'create-displayName-error',
                displayNameError
              )}
            />
            <FieldError id="create-displayName-error" message={displayNameError} />
          </div>

          <div className="space-y-2">
            <Label id="create-avatar-label">Seu avatar</Label>
            <p id="create-avatar-hint" className="text-xs text-muted-foreground">
              Escolha um para a sala
            </p>
            <AvatarPicker
              aria-labelledby="create-avatar-label"
              aria-describedby={
                avatarError ? 'create-avatar-hint create-avatar-error' : 'create-avatar-hint'
              }
              aria-invalid={avatarError ? true : undefined}
            />
            <FieldError id="create-avatar-error" message={avatarError} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roomName">Nome da sala</Label>
            <p id="roomName-hint" className="text-xs text-muted-foreground">
              Ex.: Família Coelho
            </p>
            <Input
              id="roomName"
              name="roomName"
              required
              aria-invalid={roomNameError ? true : undefined}
              aria-describedby={fieldDescribedBy(
                'roomName-hint',
                'roomName-error',
                roomNameError
              )}
            />
            <FieldError id="roomName-error" message={roomNameError} />
          </div>

          <div className="space-y-2">
            <Label id="create-fixture-label">Jogo da Copa</Label>
            <p id="create-fixture-hint" className="text-xs text-muted-foreground">
              {fixtures.length > 0
                ? 'Escolha o jogo que a família vai acompanhar nesta sala.'
                : 'Sincronize o calendário no servidor para escolher um jogo específico.'}
            </p>
            <FixturePicker
              fixtures={fixtures}
              defaultValue={defaultFixtureId}
              errorMessage={fixtureIdError}
              describedBy={fieldDescribedBy(
                'create-fixture-hint',
                'create-fixture-error',
                fixtureIdError
              )}
            />
            <FieldError id="create-fixture-error" message={fixtureIdError} />
          </div>

          {showFormError ? (
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
