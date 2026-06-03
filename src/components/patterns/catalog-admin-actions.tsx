'use client'

import { useActionState } from 'react'
import { RefreshCw } from 'lucide-react'

import {
  enrichFlagsAction,
  syncCatalogAction,
  type CatalogActionState,
} from '@/features/fixtures/actions/sync-catalog'
import { Button } from '@/components/ui/button'

const initialState: CatalogActionState = {}

type CatalogAdminActionsProps = {
  syncToken: string
}

function ActionFeedback({ state }: { state: CatalogActionState }) {
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

function CatalogAdminActions({ syncToken }: CatalogAdminActionsProps) {
  const [syncState, syncAction, syncPending] = useActionState(
    syncCatalogAction,
    initialState
  )
  const [flagsState, flagsAction, flagsPending] = useActionState(
    enrichFlagsAction,
    initialState
  )

  const busy = syncPending || flagsPending

  return (
    <div className="flex flex-col gap-3">
      <form action={syncAction} className="flex flex-col gap-2">
        <input type="hidden" name="syncToken" value={syncToken} readOnly />
        <Button
          type="submit"
          variant="party"
          className="min-h-11 w-full gap-2"
          disabled={busy}
        >
          <RefreshCw
            className={syncPending ? 'size-4 animate-spin' : 'size-4'}
            aria-hidden
          />
          {syncPending ? 'Sincronizando...' : 'Sincronizar catálogo'}
        </Button>
        <ActionFeedback state={syncState} />
      </form>
      <form action={flagsAction} className="flex flex-col gap-2">
        <input type="hidden" name="syncToken" value={syncToken} readOnly />
        <Button type="submit" variant="outline" className="min-h-11 w-full" disabled={busy}>
          {flagsPending ? 'Atualizando...' : 'Atualizar bandeiras (flagcdn)'}
        </Button>
        <ActionFeedback state={flagsState} />
      </form>
    </div>
  )
}

export { CatalogAdminActions }
