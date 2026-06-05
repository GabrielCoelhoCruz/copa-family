'use client'

import { useActionState } from 'react'
import { RefreshCw, Users } from 'lucide-react'

import {
  seedFeaturedPlayersAction,
  syncPlayerPortraitsAction,
  type PlayerPortraitActionState,
} from '@/features/players/actions/sync-portraits'
import { Button } from '@/components/ui/button'

const initialState: PlayerPortraitActionState = {}

type PlayerPortraitAdminActionsProps = {
  syncToken: string
}

function ActionFeedback({ state }: { state: PlayerPortraitActionState }) {
  const text = state.message ?? state.error
  if (!text) return null

  return (
    <p
      className={`text-sm font-medium ${state.ok ? 'text-foreground' : 'text-destructive'}`}
      role="status"
    >
      {text}
    </p>
  )
}

function PlayerPortraitAdminActions({ syncToken }: PlayerPortraitAdminActionsProps) {
  const [syncState, syncAction, syncPending] = useActionState(
    syncPlayerPortraitsAction,
    initialState
  )
  const [seedState, seedAction, seedPending] = useActionState(
    seedFeaturedPlayersAction,
    initialState
  )

  const busy = syncPending || seedPending

  return (
    <div className="flex flex-col gap-3">
      <form action={seedAction} className="flex flex-col gap-2">
        <input type="hidden" name="syncToken" value={syncToken} readOnly />
        <Button type="submit" variant="outline" className="min-h-11 w-full gap-2" disabled={busy}>
          <Users className="size-4" aria-hidden />
          {seedPending ? 'Importando...' : 'Importar lista (JSON)'}
        </Button>
        <ActionFeedback state={seedState} />
      </form>
      <form action={syncAction} className="flex flex-col gap-2">
        <input type="hidden" name="syncToken" value={syncToken} readOnly />
        <Button type="submit" variant="party" className="min-h-11 w-full gap-2" disabled={busy}>
          <RefreshCw
            className={syncPending ? 'size-4 animate-spin' : 'size-4'}
            aria-hidden
          />
          {syncPending ? 'Sincronizando...' : 'Sincronizar retratos (Storage)'}
        </Button>
        <ActionFeedback state={syncState} />
      </form>
    </div>
  )
}

export { PlayerPortraitAdminActions }
