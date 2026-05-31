import { createClient } from '@/lib/supabase/server'

export const ANALYTICS_EVENTS = {
  roomCreated: 'room_created',
  roomJoined: 'room_joined',
  predictionSubmitted: 'prediction_submitted',
  matchStarted: 'match_started',
  halftimeStarted: 'halftime_started',
  matchFinished: 'match_finished',
  rankingViewed: 'ranking_viewed',
  qrOpened: 'qr_opened',
  matchResultSubmitted: 'match_result_submitted',
  copaPareSubmitted: 'copa_pare_submitted',
} as const

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]

type TrackEventInput = {
  eventName: AnalyticsEventName
  roomId?: string
  matchId?: string
  userId?: string
  metadata?: Record<string, unknown>
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
