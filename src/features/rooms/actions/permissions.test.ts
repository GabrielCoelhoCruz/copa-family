import { describe, expect, it } from 'vitest'

import {
  canControlRoom,
  isRoomMember,
  roomMembershipRole,
} from '@/features/rooms/actions/permissions'

describe('room action permissions', () => {
  const memberships = [
    { user_id: 'owner', role: 'owner' },
    { user_id: 'co-host', role: 'co_host' },
    { user_id: 'member', role: 'member' },
  ]

  it('allows owners and co-hosts to control host actions', () => {
    expect(canControlRoom(roomMembershipRole(memberships, 'owner'))).toBe(true)
    expect(canControlRoom(roomMembershipRole(memberships, 'co-host'))).toBe(true)
  })

  it('denies regular members and missing users from host actions', () => {
    expect(canControlRoom(roomMembershipRole(memberships, 'member'))).toBe(false)
    expect(canControlRoom(roomMembershipRole(memberships, 'stranger'))).toBe(false)
  })

  it('requires room membership for player actions', () => {
    expect(isRoomMember(roomMembershipRole(memberships, 'member'))).toBe(true)
    expect(isRoomMember(roomMembershipRole(memberships, 'stranger'))).toBe(false)
  })
})
