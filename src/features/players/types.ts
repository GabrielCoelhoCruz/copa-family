export type FeaturedPlayerSeed = {
  name: string
  team: string
  sort: number
}

export type FootballPlayerUpsertRow = {
  season: number
  name: string
  slug: string
  team_name: string
  team_slug: string | null
  is_selectable: boolean
  sort_order: number
  updated_at: string
}

export type DbFootballPlayer = {
  id: string
  season: number
  name: string
  slug: string
  team_name: string
  team_slug: string | null
  thesportsdb_player_id: string | null
  photo_storage_path: string | null
  photo_url: string | null
  is_selectable: boolean
  sort_order: number
  synced_at: string | null
}

export type SelectablePlayer = Pick<
  DbFootballPlayer,
  'id' | 'name' | 'team_name' | 'photo_url' | 'sort_order'
>

export type SyncPlayerPortraitsResult = {
  ok: true
  season: number
  total: number
  uploaded: number
  skipped: number
  failed: Array<{ name: string; reason: string }>
}
