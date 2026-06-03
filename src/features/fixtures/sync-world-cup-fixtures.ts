import type { ApiFootballRateLimit } from '@/features/fixtures/api-football'
import { WORLD_CUP_LEAGUE_ID, WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import { syncWorldCupCatalog } from '@/features/fixtures/sync-world-cup-catalog'

export type SyncWorldCupFixturesResult = {
  ok: true
  upserted: number
  requestCount: number
  rateLimit?: ApiFootballRateLimit
  leagueId: number
  season: number
  syncRunId: string
  warnings: string[]
}

export async function syncWorldCupFixtures(): Promise<SyncWorldCupFixturesResult> {
  const result = await syncWorldCupCatalog({ mode: 'fixtures' })

  return {
    ok: true,
    upserted: result.fixturesUpserted,
    requestCount: result.requestCount,
    rateLimit: result.rateLimit,
    leagueId: WORLD_CUP_LEAGUE_ID,
    season: WORLD_CUP_SEASON,
    syncRunId: result.syncRunId,
    warnings: result.warnings,
  }
}
