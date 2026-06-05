'use client'

import { useEffect, useRef } from 'react'

import { createClient } from '@/lib/supabase/client'
import type { MatchStatus } from '@/lib/types'

type MatchRow = {
  id: string
  room_id: string
  status: MatchStatus
}

export type RoomLiveChannelHandlers = {
  onMatchUpdate: (row: MatchRow) => void
  onNewMatch: (row: MatchRow) => void
  onChannelError: () => void
  onSubscribed: () => void
}

type UseRoomLiveChannelInput = {
  roomId: string
  matchId: string
  enabled: boolean
  channelGeneration?: number
  handlers: RoomLiveChannelHandlers
}

export function useRoomLiveChannel({
  roomId,
  matchId,
  enabled,
  channelGeneration = 0,
  handlers,
}: UseRoomLiveChannelInput) {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!enabled) return

    const supabase = createClient()
    const channel = supabase
      .channel(`room-live:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches',
          filter: `id=eq.${matchId}`,
        },
        (payload) => {
          const row = payload.new as MatchRow
          if (row?.id) {
            handlersRef.current.onMatchUpdate(row)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as MatchRow
          if (row?.id) {
            handlersRef.current.onNewMatch(row)
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          handlersRef.current.onSubscribed()
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          handlersRef.current.onChannelError()
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [channelGeneration, enabled, matchId, roomId])
}
