'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'

import { fetchRoomLiveSnapshot } from '@/features/rooms/live/fetch-room-live-snapshot'
import {
  resolveStatusEvent,
  type RoomStatusEvent,
} from '@/features/rooms/live/room-status-events'
import { useRoomLiveChannel } from '@/features/rooms/live/use-room-live-channel'
import { ANALYTICS_EVENTS } from '@/lib/analytics-events'
import { trackClientEvent } from '@/lib/analytics-client'
import type { MatchStatus } from '@/lib/types'

import { roomLiveRevision, type RoomLiveSnapshot } from './room-live-types'

const REFRESH_DEBOUNCE_MS = 500
const POLL_INTERVAL_MS = 45_000
const RECONNECT_BASE_MS = 2_000
const RECONNECT_MAX_MS = 30_000

type RoomLiveProviderProps = {
  roomId: string
  roomCode: string
  initialMatchId: string
  initialStatus: MatchStatus
  initialShowCopaPareEvent: boolean
  children: ReactNode
}

type RoomLiveContextValue = {
  matchId: string
  matchStatus: MatchStatus
  showCopaPareEvent: boolean
  connectionState: 'live' | 'reconnecting' | 'polling'
  activeEvent: RoomStatusEvent | null
  dismissEvent: () => void
}

const RoomLiveContext = createContext<RoomLiveContextValue | null>(null)

export function useRoomLive() {
  const value = useContext(RoomLiveContext)
  if (!value) {
    throw new Error('useRoomLive must be used within RoomLiveProvider')
  }
  return value
}

function buildInitialSnapshot(
  matchId: string,
  status: MatchStatus,
  showCopaPareEvent: boolean
): RoomLiveSnapshot {
  return {
    matchId,
    status,
    showCopaPareEvent,
    revision: roomLiveRevision({ matchId, status, showCopaPareEvent }),
  }
}

export function RoomLiveProvider({
  roomId,
  roomCode,
  initialMatchId,
  initialStatus,
  initialShowCopaPareEvent,
  children,
}: RoomLiveProviderProps) {
  const router = useRouter()
  const [snapshot, setSnapshot] = useState<RoomLiveSnapshot>(() =>
    buildInitialSnapshot(initialMatchId, initialStatus, initialShowCopaPareEvent)
  )
  const [activeEvent, setActiveEvent] = useState<RoomStatusEvent | null>(null)
  const [connectionState, setConnectionState] = useState<RoomLiveContextValue['connectionState']>(
    'live'
  )
  const [channelGeneration, setChannelGeneration] = useState(0)

  const snapshotRef = useRef(snapshot)
  const previousStatusRef = useRef<MatchStatus>(initialStatus)
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const eventsEnabledRef = useRef(false)

  const clearRefreshTimer = useCallback(() => {
    if (refreshTimerRef.current != null) {
      clearTimeout(refreshTimerRef.current)
      refreshTimerRef.current = null
    }
  }, [])

  const scheduleRefresh = useCallback(
    (immediate = false) => {
      clearRefreshTimer()
      if (immediate) {
        router.refresh()
        return
      }
      refreshTimerRef.current = setTimeout(() => {
        router.refresh()
      }, REFRESH_DEBOUNCE_MS)
    },
    [clearRefreshTimer, router]
  )

  const applySnapshot = useCallback(
    (
      next: RoomLiveSnapshot,
      options?: { isNewMatch?: boolean; fromPoll?: boolean; previousRevision?: string }
    ) => {
      const prev = snapshotRef.current
      const prevStatus = previousStatusRef.current
      const matchChanged = prev.matchId !== next.matchId
      const statusChanged = prevStatus !== next.status
      const revisionChanged = (options?.previousRevision ?? prev.revision) !== next.revision

      setSnapshot(next)
      previousStatusRef.current = next.status

      if (eventsEnabledRef.current && (statusChanged || matchChanged || options?.isNewMatch)) {
        const event = resolveStatusEvent({
          roomCode,
          previousStatus: prevStatus,
          nextStatus: next.status,
          showCopaPareEvent: next.showCopaPareEvent,
          isNewMatch: Boolean(options?.isNewMatch || matchChanged),
        })
        if (event) {
          setActiveEvent(event)
        }

        if (statusChanged) {
          trackClientEvent({
            eventName: ANALYTICS_EVENTS.roomLiveStatusChanged,
            roomId,
            matchId: next.matchId,
            metadata: { from: prevStatus, to: next.status, roomCode },
          })
        }
      }

      if (options?.fromPoll && revisionChanged) {
        trackClientEvent({
          eventName: ANALYTICS_EVENTS.roomLiveFallbackPoll,
          roomId,
          matchId: next.matchId,
          metadata: { roomCode },
        })
      }
    },
    [roomCode, roomId]
  )

  const syncFromApi = useCallback(
    async (options?: { fromPoll?: boolean; isNewMatch?: boolean }) => {
      const remote = await fetchRoomLiveSnapshot(roomCode)
      if (!remote) return

      const prev = snapshotRef.current
      const drifted = remote.revision !== prev.revision

      applySnapshot(remote, {
        ...options,
        isNewMatch: options?.isNewMatch || remote.matchId !== prev.matchId,
        previousRevision: prev.revision,
      })

      if (drifted || remote.matchId !== prev.matchId) {
        scheduleRefresh(remote.matchId !== prev.matchId)
      }
    },
    [applySnapshot, roomCode, scheduleRefresh]
  )

  const handleMatchRow = useCallback(
    async (row: { id: string; status: MatchStatus }, isNewMatch: boolean) => {
      const prev = snapshotRef.current

      if (isNewMatch && row.id !== prev.matchId) {
        await syncFromApi({ isNewMatch: true })
        scheduleRefresh(true)
        return
      }

      if (row.id === prev.matchId && row.status !== prev.status) {
        const optimistic = buildInitialSnapshot(
          prev.matchId,
          row.status,
          prev.showCopaPareEvent
        )
        applySnapshot(optimistic)
        await syncFromApi()
        scheduleRefresh(false)
      }
    },
    [applySnapshot, scheduleRefresh, syncFromApi]
  )

  const channelHandlers = useMemo(
    () => ({
      onMatchUpdate: (row: { id: string; status: MatchStatus }) => {
        void handleMatchRow(row, false)
      },
      onNewMatch: (row: { id: string; status: MatchStatus }) => {
        void handleMatchRow(row, true)
      },
      onChannelError: () => {
        setConnectionState('reconnecting')
        trackClientEvent({
          eventName: ANALYTICS_EVENTS.roomLiveChannelError,
          roomId,
          matchId: snapshotRef.current.matchId,
          metadata: { roomCode },
        })
        const delay = Math.min(
          RECONNECT_BASE_MS * 2 ** reconnectAttemptRef.current,
          RECONNECT_MAX_MS
        )
        reconnectAttemptRef.current += 1
        window.setTimeout(() => {
          setChannelGeneration((value) => value + 1)
          void syncFromApi({ fromPoll: true })
        }, delay)
      },
      onSubscribed: () => {
        reconnectAttemptRef.current = 0
        setConnectionState('live')
      },
    }),
    [handleMatchRow, roomCode, roomId, syncFromApi]
  )

  useRoomLiveChannel({
    roomId,
    matchId: snapshot.matchId,
    enabled: true,
    channelGeneration,
    handlers: channelHandlers,
  })

  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      eventsEnabledRef.current = true
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        void syncFromApi({ fromPoll: true })
        scheduleRefresh(true)
      }
    }

    const onOnline = () => {
      void syncFromApi({ fromPoll: true })
      scheduleRefresh(true)
    }

    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('online', onOnline)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('online', onOnline)
      clearRefreshTimer()
    }
  }, [clearRefreshTimer, scheduleRefresh, syncFromApi])

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (document.visibilityState !== 'visible') return
      setConnectionState((state) => (state === 'live' ? 'polling' : state))
      void syncFromApi({ fromPoll: true }).finally(() => {
        setConnectionState((state) => (state === 'polling' ? 'live' : state))
      })
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(interval)
  }, [syncFromApi])

  const dismissEvent = useCallback(() => setActiveEvent(null), [])

  const value = useMemo<RoomLiveContextValue>(
    () => ({
      matchId: snapshot.matchId,
      matchStatus: snapshot.status,
      showCopaPareEvent: snapshot.showCopaPareEvent,
      connectionState,
      activeEvent,
      dismissEvent,
    }),
    [activeEvent, connectionState, dismissEvent, snapshot]
  )

  return <RoomLiveContext.Provider value={value}>{children}</RoomLiveContext.Provider>
}
