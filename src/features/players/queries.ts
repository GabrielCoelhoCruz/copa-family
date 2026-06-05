import { cache } from 'react'

import { WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import type { DbFootballPlayer, SelectablePlayer } from '@/features/players/types'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

const PLAYER_SELECT =
  'id, season, name, slug, team_name, team_slug, thesportsdb_player_id, photo_storage_path, photo_url, is_selectable, sort_order, synced_at'

export const getSelectablePlayers = cache(async (): Promise<SelectablePlayer[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('football_players')
    .select('id, name, team_name, photo_url, sort_order')
    .eq('season', WORLD_CUP_SEASON)
    .eq('is_selectable', true)
    .not('photo_url', 'is', null)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as SelectablePlayer[]
})

export async function assertSelectablePlayerId(playerId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from('football_players')
    .select('id')
    .eq('id', playerId)
    .eq('season', WORLD_CUP_SEASON)
    .eq('is_selectable', true)
    .not('photo_url', 'is', null)
    .maybeSingle()

  if (error) throw error
  return Boolean(data)
}

export async function getPlayerPortraitStats(season = WORLD_CUP_SEASON): Promise<{
  total: number
  withPhoto: number
}> {
  const admin = createAdminClient()
  const [totalRes, withPhotoRes] = await Promise.all([
    admin
      .from('football_players')
      .select('id', { count: 'exact', head: true })
      .eq('season', season),
    admin
      .from('football_players')
      .select('id', { count: 'exact', head: true })
      .eq('season', season)
      .not('photo_url', 'is', null),
  ])

  if (totalRes.error) throw totalRes.error
  if (withPhotoRes.error) throw withPhotoRes.error

  return {
    total: totalRes.count ?? 0,
    withPhoto: withPhotoRes.count ?? 0,
  }
}

export async function getFootballPlayerById(
  playerId: string
): Promise<DbFootballPlayer | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('football_players')
    .select(PLAYER_SELECT)
    .eq('id', playerId)
    .maybeSingle()

  if (error) throw error
  return data as DbFootballPlayer | null
}
