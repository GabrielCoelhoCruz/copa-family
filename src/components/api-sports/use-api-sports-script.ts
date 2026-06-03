'use client'

import { useEffect, useState } from 'react'

const WIDGET_SCRIPT_SRC = 'https://widgets.api-sports.io/3.1.0/widgets.js'

let scriptPromise: Promise<void> | null = null

function loadApiSportsScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${WIDGET_SCRIPT_SRC}"]`
    )
    if (existing) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.type = 'module'
    script.src = WIDGET_SCRIPT_SRC
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load API-Sports widgets'))
    document.head.appendChild(script)
  })

  return scriptPromise
}

export function useApiSportsScript(enabled: boolean) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enabled) return

    let cancelled = false
    loadApiSportsScript()
      .then(() => {
        if (!cancelled) setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(false)
      })

    return () => {
      cancelled = true
    }
  }, [enabled])

  return enabled && ready
}
