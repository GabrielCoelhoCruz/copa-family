import { cache } from 'react'

import { withRankingPositions } from '@/lib/ranking'
import { createClient } from '@/lib/supabase/server'
import { getFixtureById } from '@/features/fixtures/queries'
import { photoUrlFromUser, type UserWithPlayerPortrait } from '@/lib/player-portrait'
import type { DbMatch, DbRoom, DbRoomMember } from '@/lib/types'

import { avatarColorForName } from '@/lib/avatar-colors'

import { buildMemberStatusLabel } from './member-status-label'
import { resolveRoomNextAction, type RoomNextAction } from './room-next-action'

export async function getRoomByCode(roomCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('id, code, name, owner_user_id, created_at, last_host_action_at')
    .eq('code', roomCode.toUpperCase())
    .maybeSingle()

  if (error) throw error
  return data as DbRoom | null
}

export async function getCurrentMatch(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(
      'id, room_id, title, status, fixture_id, home_score, away_score, winner, player_of_match, copa_pare_category, copa_pare_letter, halftime_started_at'
    )
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as DbMatch | null
}

export async function getRoomMatchHistory(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('matches')
    .select(
      'id, room_id, title, status, fixture_id, home_score, away_score, winner, player_of_match, copa_pare_category, copa_pare_letter, halftime_started_at'
    )
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as DbMatch[]
}

export async function getLobbyStats(roomId: string, matchId: string) {
  const supabase = await createClient()
  const [membersResult, predictionsResult] = await Promise.all([
    supabase.from('room_members').select('id', { count: 'exact', head: true }).eq('room_id', roomId),
    supabase
      .from('predictions')
      .select('id', { count: 'exact', head: true })
      .eq('match_id', matchId),
  ])

  return {
    memberCount: membersResult.count ?? 0,
    predictionCount: predictionsResult.count ?? 0,
  }
}

export type MvpMetricRow = {
  eventName: string
  count: number
}

export async function getMvpMetrics(): Promise<MvpMetricRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('analytics_events')
    .select('event_name')

  if (error) throw error

  const counts = new Map<string, number>()
  for (const row of data ?? []) {
    counts.set(row.event_name, (counts.get(row.event_name) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getUserPointsInRoom(roomId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('points')
    .select('source, amount, metadata')
    .eq('room_id', roomId)
    .eq('user_id', userId)

  if (error) throw error

  const rows = (data ?? []).map((row) => ({
    source: row.source,
    amount: row.amount,
    metadata: row.metadata,
  }))
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const sources = new Set(rows.map((row) => row.source))

  return { rows, total, sources }
}

export async function getUserRoomProfile(roomId: string, userId: string) {
  const supabase = await createClient()
  const { data: member } = await supabase
    .from('room_members')
    .select(
      'role, users(display_name, avatar_key, avatar_player_id, football_players(photo_url))'
    )
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!member) return null

  const users = Array.isArray(member.users) ? member.users[0] : member.users
  const { rows, total, sources } = await getUserPointsInRoom(roomId, userId)

  const userRow = users as UserWithPlayerPortrait | undefined

  return {
    displayName: userRow?.display_name ?? 'Jogador',
    avatarKey: userRow?.avatar_key ?? 'player',
    avatarPhotoUrl: userRow ? photoUrlFromUser(userRow) : null,
    role: member.role as DbRoomMember['role'],
    points: total,
    sources,
    pointRows: rows,
  }
}

export async function getMatchParticipantUserIds(matchId: string) {
  const supabase = await createClient()
  const [predictionsResult, copaPareResult] = await Promise.all([
    supabase.from('predictions').select('user_id').eq('match_id', matchId),
    supabase.from('copa_pare_entries').select('user_id').eq('match_id', matchId),
  ])

  if (predictionsResult.error) throw predictionsResult.error
  if (copaPareResult.error) throw copaPareResult.error

  return {
    predictionUserIds: new Set(
      (predictionsResult.data ?? []).map((row) => row.user_id)
    ),
    copaPareUserIds: new Set(
      (copaPareResult.data ?? []).map((row) => row.user_id)
    ),
  }
}

export type RoomMemberBoardRow = {
  userId: string
  displayName: string
  avatarInitial: string
  avatarColor: string
  avatarPhotoUrl: string | null
  role: DbRoomMember['role']
  points: number
  position: number
  statusLabel: string
  hasPrediction: boolean
  hasCopaPare: boolean
  isCurrentUser: boolean
}

export async function getRoomMemberBoard(
  context: RoomContext,
  matchId: string,
  matchStatus: DbMatch['status'],
  userId: string | null
): Promise<RoomMemberBoardRow[]> {
  const { predictionUserIds, copaPareUserIds } =
    await getMatchParticipantUserIds(matchId)

  return withRankingPositions(rankingFromContext(context)).map((entry) => {
    const hasPrediction = predictionUserIds.has(entry.userId)
    const hasCopaPare = copaPareUserIds.has(entry.userId)

    return {
      userId: entry.userId,
      displayName: entry.displayName,
      avatarInitial: entry.displayName.slice(0, 1).toUpperCase(),
      avatarColor: avatarColorForName(entry.displayName),
      avatarPhotoUrl: entry.avatarPhotoUrl,
      role: entry.role,
      points: entry.points,
      position: entry.position,
      hasPrediction,
      hasCopaPare,
      isCurrentUser: entry.userId === userId,
      statusLabel: buildMemberStatusLabel(
        matchStatus,
        hasPrediction,
        hasCopaPare
      ),
    }
  })
}

export type RoomMatchHistorySummary = {
  matchId: string
  homeTeamName: string
  awayTeamName: string
  homeScore: number
  awayScore: number
  topPlayerName: string | null
}

export async function getRoomMatchHistorySummaries(
  roomId: string,
  currentMatchId: string,
  members: RoomContext['members']
): Promise<RoomMatchHistorySummary[]> {
  const history = await getRoomMatchHistory(roomId)
  const finished = history.filter(
    (row) =>
      row.id !== currentMatchId &&
      row.status === 'finished' &&
      row.home_score != null &&
      row.away_score != null
  )

  const summaries = await Promise.all(
    finished.slice(0, 6).map(async (row) => {
      const fixture =
        row.fixture_id != null ? await getFixtureById(row.fixture_id) : null
      const pointsByUser = await getMemberPointsForMatch(roomId, row.id)

      let topPlayerName: string | null = null
      let topPoints = -1
      for (const [memberUserId, points] of pointsByUser) {
        if (points > topPoints) {
          topPoints = points
          const member = members.find((m) => m.user_id === memberUserId)
          topPlayerName = member?.users.display_name ?? null
        }
      }

      return {
        matchId: row.id,
        homeTeamName: fixture?.home_team_name ?? '—',
        awayTeamName: fixture?.away_team_name ?? '—',
        homeScore: row.home_score!,
        awayScore: row.away_score!,
        topPlayerName,
      }
    })
  )

  return summaries
}

export async function getMatchPredictionSuggestions(matchId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('predictions')
    .select('winner, player_of_match')
    .eq('match_id', matchId)

  if (error) throw error

  const winners = new Set<string>()
  const players = new Set<string>()

  for (const row of data ?? []) {
    if (row.winner?.trim()) winners.add(row.winner.trim())
    if (row.player_of_match?.trim()) players.add(row.player_of_match.trim())
  }

  return {
    winners: [...winners].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    players: [...players].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  }
}

export const getCopaPareEntry = cache(async (matchId: string, userId: string) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('copa_pare_entries')
    .select('category, answer')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
})

export async function getRoomMembers(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('room_members')
    .select(
      'id, room_id, user_id, role, users(id, display_name, avatar_key, avatar_player_id, football_players(photo_url))'
    )
    .eq('room_id', roomId)
    .order('joined_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row) => {
    const users = Array.isArray(row.users) ? row.users[0] : row.users
    return {
      id: row.id,
      room_id: row.room_id,
      user_id: row.user_id,
      role: row.role,
      users: users as UserWithPlayerPortrait,
    }
  })
}

export async function getMemberPoints(roomId: string) {
  return getMemberPointsForScope(roomId)
}

export async function getMemberPointsForMatch(roomId: string, matchId: string) {
  return getMemberPointsForScope(roomId, matchId)
}

async function getMemberPointsForScope(roomId: string, matchId?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('points')
    .select('user_id, amount')
    .eq('room_id', roomId)

  if (matchId) {
    query = query.eq('match_id', matchId)
  }

  const { data, error } = await query

  if (error) throw error

  const totals = new Map<string, number>()
  for (const row of data ?? []) {
    totals.set(row.user_id, (totals.get(row.user_id) ?? 0) + row.amount)
  }
  return totals
}

export const getRoomContext = cache(async (roomCode: string) => {
  const room = await getRoomByCode(roomCode)
  if (!room) return null

  const [match, members, pointsByUser] = await Promise.all([
    getCurrentMatch(room.id),
    getRoomMembers(room.id),
    getMemberPoints(room.id),
  ])

  if (!match) return null

  const fixture =
    match.fixture_id != null
      ? await getFixtureById(match.fixture_id)
      : null

  return { room, match, fixture, members, pointsByUser }
})

export type RoomContext = NonNullable<Awaited<ReturnType<typeof getRoomContext>>>

export type RankingEntry = {
  userId: string
  displayName: string
  avatarKey: string
  avatarPhotoUrl: string | null
  role: DbRoomMember['role']
  points: number
}

function memberToRankingEntry(
  member: { user_id: string; role: DbRoomMember['role']; users: UserWithPlayerPortrait },
  points: number
): RankingEntry {
  return {
    userId: member.user_id,
    displayName: member.users.display_name,
    avatarKey: member.users.avatar_key,
    avatarPhotoUrl: photoUrlFromUser(member.users),
    role: member.role,
    points,
  }
}

function rankingFromContext(context: RoomContext): RankingEntry[] {
  return context.members
    .map((member) =>
      memberToRankingEntry(member, context.pointsByUser.get(member.user_id) ?? 0)
    )
    .sort((left, right) => right.points - left.points)
}

export async function getRanking(roomId: string): Promise<RankingEntry[]> {
  const [members, pointsByUser] = await Promise.all([
    getRoomMembers(roomId),
    getMemberPoints(roomId),
  ])

  return members
    .map((member) =>
      memberToRankingEntry(member, pointsByUser.get(member.user_id) ?? 0)
    )
    .sort((left, right) => right.points - left.points)
}

export async function getMatchRanking(
  roomId: string,
  matchId: string
): Promise<RankingEntry[]> {
  const [members, pointsByUser] = await Promise.all([
    getRoomMembers(roomId),
    getMemberPointsForMatch(roomId, matchId),
  ])

  return members
    .map((member) =>
      memberToRankingEntry(member, pointsByUser.get(member.user_id) ?? 0)
    )
    .sort((left, right) => right.points - left.points)
}

export async function getUserWinnerStreakSummary(roomId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('points')
    .select('metadata')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .eq('source', 'match_winner_correct')

  if (error) throw error

  const streaks = (data ?? [])
    .map((row) => {
      const metadata = row.metadata as { streakLength?: unknown } | null
      return typeof metadata?.streakLength === 'number' ? metadata.streakLength : 0
    })
    .filter((streak) => streak > 0)

  return {
    current: streaks.at(-1) ?? 0,
    best: streaks.length > 0 ? Math.max(...streaks) : 0,
  }
}

export async function getUserPrediction(matchId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('predictions')
    .select('id, winner, home_score, away_score, player_of_match')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export type RoomDashboardData = {
  stats: { memberCount: number; predictionCount: number }
  userPosition: number | null
  userPoints: number
  currentMatchPoints: number
  hasPrediction: boolean
  hasCopaPareEntry: boolean
  nextAction: RoomNextAction
  winnerSuggestions: string[]
  playerSuggestions: string[]
}

export async function getRoomDashboardData(
  context: RoomContext,
  userId: string | null,
  isOwner: boolean
): Promise<RoomDashboardData> {
  const { room, match, pointsByUser } = context

  const [stats, prediction, copaPareEntry, suggestions, matchPointsByUser] = await Promise.all([
    getLobbyStats(room.id, match.id),
    userId != null
      ? getUserPrediction(match.id, userId)
      : Promise.resolve(null),
    userId != null
      ? getCopaPareEntry(match.id, userId)
      : Promise.resolve(null),
    isOwner
      ? getMatchPredictionSuggestions(match.id)
      : Promise.resolve({ winners: [], players: [] }),
    getMemberPointsForMatch(room.id, match.id),
  ])

  const userPoints = userId != null ? (pointsByUser.get(userId) ?? 0) : 0
  const currentMatchPoints =
    userId != null ? (matchPointsByUser.get(userId) ?? 0) : 0
  const ranked = withRankingPositions(rankingFromContext(context))
  const userEntry = userId != null ? ranked.find((e) => e.userId === userId) : null
  const hasPrediction = prediction != null
  const hasCopaPareEntry = copaPareEntry != null

  const nextAction = resolveRoomNextAction({
    roomCode: room.code,
    status: match.status,
    isOwner,
    hasPrediction,
    hasCopaPareEntry,
    predictionCount: stats.predictionCount,
    memberCount: stats.memberCount,
  })

  return {
    stats,
    userPosition: userEntry?.position ?? null,
    userPoints,
    currentMatchPoints,
    hasPrediction,
    hasCopaPareEntry,
    nextAction,
    winnerSuggestions: suggestions.winners,
    playerSuggestions: suggestions.players,
  }
}
