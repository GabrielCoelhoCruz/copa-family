'use client'

import { useSyncExternalStore } from 'react'

type Listener = () => void

const listeners = new Set<Listener>()
let intervalId: ReturnType<typeof setInterval> | null = null
let currentTick = typeof window === 'undefined' ? 0 : Date.now()

function subscribe(listener: Listener) {
  listeners.add(listener)
  if (intervalId === null) {
    intervalId = setInterval(() => {
      currentTick = Date.now()
      for (const notify of listeners) {
        notify()
      }
    }, 1000)
  }
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0 && intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }
}

function getClientSnapshot() {
  return currentTick
}

function getServerSnapshot() {
  return 0
}

/** Monotonic clock tick every second — for countdowns without useEffect in components */
export function useNowMs() {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}

/** nowMs === 0 means server/initial snapshot: show full time, never negative. */
export function getRemainingSeconds(deadlineMs: number, nowMs: number, totalSeconds: number) {
  if (nowMs === 0) return totalSeconds
  return Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000))
}
