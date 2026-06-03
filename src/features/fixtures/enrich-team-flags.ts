import { WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import { isKnockoutPlaceholderName } from '@/features/fixtures/normalize'
import { nationalTeamFlagUrl } from '@/features/fixtures/team-country-flags'
import { createAdminClient } from '@/lib/supabase/admin'

const UPDATE_BATCH_SIZE = 20

export type EnrichTeamFlagsResult = {
  updated: number
  skipped: number
  total: number
}

type PendingUpdate = {
  id: string
  badge_url: string
  flag_url: string
}

async function applyTeamFlagUpdates(
  admin: ReturnType<typeof createAdminClient>,
  updates: PendingUpdate[]
): Promise<void> {
  const syncedAt = new Date().toISOString()

  for (let i = 0; i < updates.length; i += UPDATE_BATCH_SIZE) {
    const batch = updates.slice(i, i + UPDATE_BATCH_SIZE)
    const results = await Promise.all(
      batch.map((row) =>
        admin
          .from('football_teams')
          .update({
            badge_url: row.badge_url,
            flag_url: row.flag_url,
            updated_at: syncedAt,
          })
          .eq('id', row.id)
      )
    )

    const failed = results.some((r) => r.error)
    if (failed) {
      throw new Error('Falha ao atualizar lote de bandeiras.')
    }
  }
}

export async function enrichTeamFlagsFromFlagcdn(
  season = WORLD_CUP_SEASON
): Promise<EnrichTeamFlagsResult> {
  const admin = createAdminClient()
  const { data: teams, error } = await admin
    .from('football_teams')
    .select('id, name')
    .eq('season', season)

  if (error) throw new Error(error.message)

  const pending: PendingUpdate[] = []
  let skipped = 0

  for (const team of teams ?? []) {
    if (isKnockoutPlaceholderName(team.name)) {
      skipped += 1
      continue
    }
    const flagUrl = nationalTeamFlagUrl(team.name)
    if (!flagUrl) {
      skipped += 1
      continue
    }
    pending.push({ id: team.id, badge_url: flagUrl, flag_url: flagUrl })
  }

  await applyTeamFlagUpdates(admin, pending)

  return {
    updated: pending.length,
    skipped,
    total: teams?.length ?? 0,
  }
}
