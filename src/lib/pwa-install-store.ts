'use client'

import { useSyncExternalStore } from 'react'

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'copa-family-pwa-dismiss'

type PwaInstallSnapshot = {
  dismissed: boolean
  isStandalone: boolean
  isIosHint: boolean
  deferredPrompt: BeforeInstallPromptEvent | null
}

const SERVER_SNAPSHOT: PwaInstallSnapshot = {
  dismissed: true,
  isStandalone: false,
  isIosHint: false,
  deferredPrompt: null,
}

let deferredPrompt: BeforeInstallPromptEvent | null = null
let cachedSnapshot: PwaInstallSnapshot | null = null
const listeners = new Set<() => void>()

function readDismissed() {
  return window.localStorage.getItem(DISMISS_KEY) === '1'
}

function readStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator &&
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true)
  )
}

function readIosHint() {
  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) &&
    !('BeforeInstallPromptEvent' in window)
  )
}

function computeSnapshot(): PwaInstallSnapshot {
  const dismissed = readDismissed()
  const isStandalone = readStandalone()
  const isIosHint = !dismissed && !isStandalone && readIosHint()

  return {
    dismissed,
    isStandalone,
    isIosHint,
    deferredPrompt: dismissed || isStandalone ? null : deferredPrompt,
  }
}

/** Recompute (new reference) and notify — the only way the snapshot changes. */
function refresh() {
  cachedSnapshot = computeSnapshot()
  for (const listener of listeners) {
    listener()
  }
}

function getSnapshot(): PwaInstallSnapshot {
  if (typeof window === 'undefined') return SERVER_SNAPSHOT
  if (cachedSnapshot === null) cachedSnapshot = computeSnapshot()
  return cachedSnapshot
}

let initialized = false

function ensureBrowserSubscription() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    refresh()
  })
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  ensureBrowserSubscription()
  return () => {
    listeners.delete(listener)
  }
}

export function usePwaInstallStore() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT)
}

export function dismissPwaInstall() {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DISMISS_KEY, '1')
  }
  deferredPrompt = null
  refresh()
}

export function clearPwaDeferredPrompt() {
  deferredPrompt = null
  refresh()
}

export function isPwaBannerVisible(snapshot: PwaInstallSnapshot) {
  if (snapshot.dismissed || snapshot.isStandalone) return false
  return snapshot.isIosHint || snapshot.deferredPrompt !== null
}
