import type { AnalyticsEventName } from '@/lib/analytics-events'

type TrackClientEventInput = {
  eventName: AnalyticsEventName
  roomId?: string
  matchId?: string
  metadata?: Record<string, unknown>
}

export function trackClientEvent(input: TrackClientEventInput) {
  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => {
    // Analytics must not break live sync
  })
}
