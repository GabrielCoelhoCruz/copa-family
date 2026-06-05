'use server'

import { revalidatePath } from 'next/cache'

import { syncPlayerPortraits } from '@/features/players/sync-player-portraits'
import type { SyncPlayerPortraitsResult } from '@/features/players/types'
import { assertCatalogAdminAction } from '@/lib/admin/metrics-gate'
import { routes } from '@/lib/routes'

export type PlayerPortraitActionState = {
  ok?: boolean
  error?: string
  message?: string
}

function revalidatePlayerPaths(): void {
  revalidatePath(routes.criarSala, 'layout')
  revalidatePath(routes.entrar, 'layout')
  revalidatePath(routes.adminCatalogo)
}

export async function syncPlayerPortraitsAction(
  _prev: PlayerPortraitActionState,
  formData: FormData
): Promise<PlayerPortraitActionState> {
  try {
    assertCatalogAdminAction(formData)
    const result: SyncPlayerPortraitsResult = await syncPlayerPortraits()
    revalidatePlayerPaths()
    return {
      ok: true,
      message: `Retratos: ${result.uploaded} enviados, ${result.skipped} ignorados de ${result.total}.`,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Falha ao sincronizar retratos.',
    }
  }
}

export async function seedFeaturedPlayersAction(
  _prev: PlayerPortraitActionState,
  formData: FormData
): Promise<PlayerPortraitActionState> {
  try {
    assertCatalogAdminAction(formData)
    const { seedFeaturedPlayers } = await import('@/features/players/seed-featured-players')
    const result = await seedFeaturedPlayers()
    revalidatePlayerPaths()
    return {
      ok: true,
      message: `Lista de jogadores atualizada: ${result.upserted} registros.`,
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Falha ao importar jogadores.',
    }
  }
}
