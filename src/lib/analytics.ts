import { createClient } from '@/lib/supabase/server'

import {
  ANALYTICS_EVENTS,
  type AnalyticsEventName,
} from '@/lib/analytics-events'

export { ANALYTICS_EVENTS, type AnalyticsEventName }

type TrackEventInput = {
  eventName: AnalyticsEventName
  roomId?: string
  matchId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

type TrackFailureInput = Omit<TrackEventInput, 'eventName' | 'metadata'> & {
  eventName:
    | typeof ANALYTICS_EVENTS.actionFailed
    | typeof ANALYTICS_EVENTS.permissionDenied
    | typeof ANALYTICS_EVENTS.syncFailed
    | typeof ANALYTICS_EVENTS.scoreFailed
  action: string
  reason: string
}

export async function trackEvent({
  eventName,
  roomId,
  matchId,
  userId,
  metadata,
}: TrackEventInput) {
  try {
    const supabase = await createClient()
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      room_id: roomId ?? null,
      match_id: matchId ?? null,
      user_id: userId ?? null,
      metadata: metadata ?? null,
    })
  } catch {
    // Analytics must not break user flows
  }
}

export async function trackFailureEvent({
  eventName,
  action,
  reason,
  roomId,
  matchId,
  userId,
}: TrackFailureInput) {
  await trackEvent({
    eventName,
    roomId,
    matchId,
    userId,
    metadata: {
      action,
      reason,
    },
  })
}
