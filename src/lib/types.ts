export type MatchStatus =
  | 'lobby'
  | 'predictions_open'
  | 'live'
  | 'halftime'
  | 'finished'

export type RoomMemberRole = 'owner' | 'member'

export type DbUser = {
  id: string
  display_name: string
  avatar_key: string
}

export type DbRoom = {
  id: string
  code: string
  name: string
  owner_user_id: string
}

export type DbMatch = {
  id: string
  room_id: string
  title: string
  status: MatchStatus
  home_score: number | null
  away_score: number | null
  winner: string | null
  player_of_match: string | null
}

export type DbRoomMember = {
  id: string
  room_id: string
  user_id: string
  role: RoomMemberRole
  users: DbUser
}
