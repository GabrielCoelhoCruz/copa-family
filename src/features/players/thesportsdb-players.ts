import { THESPORTSDB_BASE_URL } from '@/features/fixtures/constants'
import { getTheSportsDbApiKey } from '@/lib/env'

export type TheSportsDbPlayer = {
  idPlayer: string
  strPlayer: string
  strTeam?: string | null
  strThumb?: string | null
  strCutout?: string | null
  strRender?: string | null
}

type SearchPlayersResponse = {
  player: TheSportsDbPlayer[] | TheSportsDbPlayer | null
}

type SearchTeamsResponse = {
  teams: Array<{ idTeam: string; strTeam: string }> | null
}

type LookupPlayersResponse = {
  player: TheSportsDbPlayer[] | null
}

function normalizePlayerList(
  raw: TheSportsDbPlayer[] | TheSportsDbPlayer | null | undefined
): TheSportsDbPlayer[] {
  if (!raw) return []
  return Array.isArray(raw) ? raw : [raw]
}

/**
 * Cutout/render look best in the large picker modal; thumb is fallback for small circles.
 * @see https://www.thesportsdb.com/docs_api_examples (player strThumb, strCutout)
 */
export function pickBestPlayerPhotoUrl(player: TheSportsDbPlayer): string | null {
  const candidates = [player.strCutout, player.strRender, player.strThumb]
  for (const url of candidates) {
    const trimmed = url?.trim()
    if (trimmed && trimmed.startsWith('http')) return trimmed
  }
  return null
}

async function fetchTheSportsDb<T>(path: string): Promise<T> {
  const key = getTheSportsDbApiKey()
  const url = `${THESPORTSDB_BASE_URL}/${key}/${path}`
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) {
    throw new Error(`TheSportsDB ${path} failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export async function searchTheSportsDbTeamId(teamName: string): Promise<string | null> {
  const data = await fetchTheSportsDb<SearchTeamsResponse>(
    `searchteams.php?t=${encodeURIComponent(teamName)}`
  )
  const teams = data.teams
  if (!teams) return null
  const list = Array.isArray(teams) ? teams : [teams]
  const match =
    list.find((t) => t.strTeam.toLowerCase() === teamName.toLowerCase()) ?? list[0]
  return match?.idTeam ?? null
}

export async function lookupPlayersByTeamId(teamId: string): Promise<TheSportsDbPlayer[]> {
  const data = await fetchTheSportsDb<LookupPlayersResponse>(
    `lookup_all_players.php?id=${encodeURIComponent(teamId)}`
  )
  return data.player ?? []
}

export async function searchTheSportsDbPlayer(
  playerName: string,
  teamName?: string
): Promise<TheSportsDbPlayer | null> {
  const data = await fetchTheSportsDb<SearchPlayersResponse>(
    `searchplayers.php?p=${encodeURIComponent(playerName)}`
  )
  const players = normalizePlayerList(data.player)
  if (players.length === 0) return null

  if (teamName) {
    const byTeam = players.find(
      (p) => p.strTeam?.toLowerCase() === teamName.toLowerCase()
    )
    if (byTeam) return byTeam
  }

  const exact = players.find(
    (p) => p.strPlayer.toLowerCase() === playerName.toLowerCase()
  )
  return exact ?? players[0] ?? null
}

export async function resolveTheSportsDbPlayer(
  playerName: string,
  teamName: string
): Promise<{ player: TheSportsDbPlayer; photoUrl: string } | null> {
  let player = await searchTheSportsDbPlayer(playerName, teamName)

  if (!player) {
    const teamId = await searchTheSportsDbTeamId(teamName)
    if (teamId) {
      const roster = await lookupPlayersByTeamId(teamId)
      const normalized = playerName.toLowerCase()
      player =
        roster.find((p) => p.strPlayer.toLowerCase() === normalized) ??
        roster.find((p) => p.strPlayer.toLowerCase().includes(normalized)) ??
        null
    }
  }

  if (!player) return null

  const photoUrl = pickBestPlayerPhotoUrl(player)
  if (!photoUrl) return null

  return { player, photoUrl }
}
