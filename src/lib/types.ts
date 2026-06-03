export type MatchStatus =
  | 'lobby'
  | 'predictions_open'
  | 'live'
  | 'halftime'
  | 'finished'

export type RoomMemberRole = 'owner' | 'co_host' | 'member'

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
  created_at?: string
  last_host_action_at?: string | null
}

export type DbFootballTeam = {
  id: string
  season: number
  name: string
  short_name: string | null
  slug: string
  country_code: string | null
  flag_url: string | null
  badge_url: string | null
  group_name: string | null
  is_qualified: boolean
}

export type DbFootballVenue = {
  id: string
  name: string
  city: string | null
  country: string | null
  timezone: string | null
  slug: string
}

export type DbFootballFixture = {
  id: string
  provider: string
  provider_fixture_id: number
  league_id: number
  season: number
  round: string | null
  stage: string | null
  group_name: string | null
  kickoff_at: string | null
  status_short: string | null
  status_long: string | null
  elapsed: number | null
  venue_name: string | null
  venue_city: string | null
  home_team_id: number | null
  home_team_name: string
  home_team_logo: string | null
  away_team_id: number | null
  away_team_name: string
  away_team_logo: string | null
  home_goals: number | null
  away_goals: number | null
  home_team_ref?: string | null
  away_team_ref?: string | null
  venue_ref?: string | null
}

export type DbMatch = {
  id: string
  room_id: string
  title: string
  status: MatchStatus
  fixture_id: string | null
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

export type TeamGroup = {
  groupName: string
  teams: DbFootballTeam[]
}
