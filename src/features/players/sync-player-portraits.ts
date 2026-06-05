import { WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import { PLAYER_PORTRAITS_BUCKET } from '@/features/players/constants'
import { resolveTheSportsDbPlayer } from '@/features/players/thesportsdb-players'
import type { SyncPlayerPortraitsResult } from '@/features/players/types'
import { createAdminClient } from '@/lib/supabase/admin'

const SYNC_DELAY_MS = 400

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extensionFromContentType(contentType: string | null): string {
  if (!contentType) return 'jpg'
  if (contentType.includes('png')) return 'png'
  if (contentType.includes('webp')) return 'webp'
  if (contentType.includes('gif')) return 'gif'
  return 'jpg'
}

function publicStorageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!base) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return `${base}/storage/v1/object/public/${PLAYER_PORTRAITS_BUCKET}/${storagePath}`
}

export async function syncPlayerPortraits(
  season = WORLD_CUP_SEASON
): Promise<SyncPlayerPortraitsResult> {
  const admin = createAdminClient()

  const { data: players, error } = await admin
    .from('football_players')
    .select('id, name, slug, team_name')
    .eq('season', season)
    .eq('is_selectable', true)
    .order('sort_order', { ascending: true })

  if (error) throw new Error(error.message)

  const result: SyncPlayerPortraitsResult = {
    ok: true,
    season,
    total: players?.length ?? 0,
    uploaded: 0,
    skipped: 0,
    failed: [],
  }

  for (const row of players ?? []) {
    try {
      const resolved = await resolveTheSportsDbPlayer(row.name, row.team_name)
      if (!resolved) {
        result.skipped += 1
        result.failed.push({
          name: row.name,
          reason: 'Jogador ou foto não encontrados na TheSportsDB',
        })
        await sleep(SYNC_DELAY_MS)
        continue
      }

      const imageRes = await fetch(resolved.photoUrl)
      if (!imageRes.ok) {
        result.skipped += 1
        result.failed.push({
          name: row.name,
          reason: `Download da imagem falhou (${imageRes.status})`,
        })
        await sleep(SYNC_DELAY_MS)
        continue
      }

      const contentType = imageRes.headers.get('content-type')
      const ext = extensionFromContentType(contentType)
      const storagePath = `${season}/${row.slug}.${ext}`
      const buffer = Buffer.from(await imageRes.arrayBuffer())

      const { error: uploadError } = await admin.storage
        .from(PLAYER_PORTRAITS_BUCKET)
        .upload(storagePath, buffer, {
          upsert: true,
          contentType: contentType ?? `image/${ext}`,
          cacheControl: '31536000',
        })

      if (uploadError) {
        result.skipped += 1
        result.failed.push({ name: row.name, reason: uploadError.message })
        await sleep(SYNC_DELAY_MS)
        continue
      }

      const photoUrl = publicStorageUrl(storagePath)
      const syncedAt = new Date().toISOString()

      const { error: updateError } = await admin
        .from('football_players')
        .update({
          thesportsdb_player_id: resolved.player.idPlayer,
          photo_storage_path: storagePath,
          photo_url: photoUrl,
          synced_at: syncedAt,
          updated_at: syncedAt,
        })
        .eq('id', row.id)

      if (updateError) {
        result.failed.push({ name: row.name, reason: updateError.message })
        result.skipped += 1
      } else {
        result.uploaded += 1
      }
    } catch (err) {
      result.failed.push({
        name: row.name,
        reason: err instanceof Error ? err.message : 'Erro desconhecido',
      })
      result.skipped += 1
    }

    await sleep(SYNC_DELAY_MS)
  }

  return result
}
