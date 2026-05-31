import { createClient } from '@/lib/supabase/server'
import type { DbMatch, DbRoom, DbRoomMember, MatchStatus } from '@/lib/types'

export async function getRoomByCode(roomCode: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('id, code, name, owner_user_id')
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
      'id, room_id, title, status, home_score, away_score, winner, player_of_match'
    )
    .eq('room_id', roomId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data as DbMatch | null
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

export async function getUserRoomProfile(roomId: string, userId: string) {
  const supabase = await createClient()
  const { data: member } = await supabase
    .from('room_members')
    .select('role, users(display_name, avatar_key)')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle()

  if (!member) return null

  const users = Array.isArray(member.users) ? member.users[0] : member.users
  const pointsByUser = await getMemberPoints(roomId)

  const { data: pointRows } = await supabase
    .from('points')
    .select('source')
    .eq('room_id', roomId)
    .eq('user_id', userId)

  const sources = new Set((pointRows ?? []).map((row) => row.source))

  return {
    displayName: users?.display_name ?? 'Jogador',
    avatarKey: users?.avatar_key ?? 'lion',
    role: member.role as DbRoomMember['role'],
    points: pointsByUser.get(userId) ?? 0,
    sources,
  }
}

export async function getCopaPareEntry(matchId: string, userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('copa_pare_entries')
    .select('category, answer')
    .eq('match_id', matchId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getRoomMembers(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('room_members')
    .select('id, room_id, user_id, role, users(id, display_name, avatar_key)')
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
      users: users as DbRoomMember['users'],
    }
  })
}

export async function getMemberPoints(roomId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('points')
    .select('user_id, amount')
    .eq('room_id', roomId)

  if (error) throw error

  const totals = new Map<string, number>()
  for (const row of data ?? []) {
    totals.set(row.user_id, (totals.get(row.user_id) ?? 0) + row.amount)
  }
  return totals
}

export async function getRoomContext(roomCode: string) {
  const room = await getRoomByCode(roomCode)
  if (!room) return null

  const [match, members, pointsByUser] = await Promise.all([
    getCurrentMatch(room.id),
    getRoomMembers(room.id),
    getMemberPoints(room.id),
  ])

  if (!match) return null

  return { room, match, members, pointsByUser }
}

export type RankingEntry = {
  userId: string
  displayName: string
  avatarKey: string
  role: DbRoomMember['role']
  points: number
}

export async function getRanking(roomId: string): Promise<RankingEntry[]> {
  const [members, pointsByUser] = await Promise.all([
    getRoomMembers(roomId),
    getMemberPoints(roomId),
  ])

  return members
    .map((member) => ({
      userId: member.user_id,
      displayName: member.users.display_name,
      avatarKey: member.users.avatar_key,
      role: member.role,
      points: pointsByUser.get(member.user_id) ?? 0,
    }))
    .sort((left, right) => right.points - left.points)
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

export async function updateMatchStatus(matchId: string, status: MatchStatus) {
  const supabase = await createClient()
  const timestamps: Record<string, string | null> = {}

  if (status === 'live') timestamps.started_at = new Date().toISOString()
  if (status === 'halftime') timestamps.halftime_started_at = new Date().toISOString()
  if (status === 'finished') timestamps.finished_at = new Date().toISOString()

  const { error } = await supabase
    .from('matches')
    .update({ status, ...timestamps })
    .eq('id', matchId)

  if (error) throw error
}
