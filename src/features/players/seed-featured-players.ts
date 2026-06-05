import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import { slugifyName } from '@/features/fixtures/normalize'
import type { FeaturedPlayerSeed, FootballPlayerUpsertRow } from '@/features/players/types'
import { createAdminClient } from '@/lib/supabase/admin'

function featuredPlayersPath(): string {
  return path.join(process.cwd(), 'data', 'world-cup', 'featured-players.json')
}

export async function loadFeaturedPlayersJson(): Promise<FeaturedPlayerSeed[]> {
  const raw = await readFile(featuredPlayersPath(), 'utf8')
  const parsed = JSON.parse(raw) as FeaturedPlayerSeed[]
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('featured-players.json is empty or invalid')
  }
  return parsed
}

export type SeedFeaturedPlayersResult = {
  season: number
  upserted: number
}

export async function seedFeaturedPlayers(
  season = WORLD_CUP_SEASON
): Promise<SeedFeaturedPlayersResult> {
  const seeds = await loadFeaturedPlayersJson()
  const admin = createAdminClient()
  const now = new Date().toISOString()

  const rows: FootballPlayerUpsertRow[] = seeds.map((seed) => ({
    season,
    name: seed.name,
    slug: slugifyName(seed.name),
    team_name: seed.team,
    team_slug: slugifyName(seed.team),
    is_selectable: true,
    sort_order: seed.sort,
    updated_at: now,
  }))

  const { error } = await admin.from('football_players').upsert(rows, {
    onConflict: 'season,slug',
  })

  if (error) throw new Error(error.message)

  return { season, upserted: rows.length }
}
