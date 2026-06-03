'use server'

import { revalidatePath } from 'next/cache'

import { enrichTeamFlagsFromFlagcdn } from '@/features/fixtures/enrich-team-flags'
import type { EnrichTeamFlagsResult } from '@/features/fixtures/enrich-team-flags'
import { syncWorldCupCatalog } from '@/features/fixtures/sync-world-cup-catalog'
import type { SyncWorldCupCatalogResult } from '@/features/fixtures/sync-world-cup-catalog'
import { assertCatalogAdminAction } from '@/lib/admin/metrics-gate'
import { routes } from '@/lib/routes'

export type CatalogActionState = {
  ok?: boolean
  error?: string
  message?: string
}

function revalidateCatalogPaths(): void {
  revalidatePath(routes.calendario)
  revalidatePath(routes.criarSala, 'layout')
  revalidatePath(routes.adminCatalogo)
}

async function runCatalogAdminAction<T>(
  formData: FormData,
  run: () => Promise<{ message: string; result: T }>
): Promise<CatalogActionState> {
  try {
    assertCatalogAdminAction(formData)
    const { message } = await run()
    revalidateCatalogPaths()
    return { ok: true, message }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Operação falhou.',
    }
  }
}

export async function syncCatalogAction(
  _prev: CatalogActionState,
  formData: FormData
): Promise<CatalogActionState> {
  return runCatalogAdminAction(formData, async () => {
    const result: SyncWorldCupCatalogResult = await syncWorldCupCatalog({
      provider: 'wc26-rapidapi',
      mode: 'catalog',
    })
    return {
      message: `Catálogo sincronizado: ${result.fixturesUpserted} jogos, ${result.teamsUpserted} seleções.`,
      result,
    }
  })
}

export async function enrichFlagsAction(
  _prev: CatalogActionState,
  formData: FormData
): Promise<CatalogActionState> {
  return runCatalogAdminAction(formData, async () => {
    const result: EnrichTeamFlagsResult = await enrichTeamFlagsFromFlagcdn()
    return {
      message: `Bandeiras atualizadas: ${result.updated} seleções.`,
      result,
    }
  })
}
