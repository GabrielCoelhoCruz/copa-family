export const ANALYTICS_EVENTS = {
  roomCreated: 'room_created',
  roomJoined: 'room_joined',
  predictionSubmitted: 'prediction_submitted',
  quickReactionSubmitted: 'quick_reaction_submitted',
  matchStarted: 'match_started',
  halftimeStarted: 'halftime_started',
  matchFinished: 'match_finished',
  rankingViewed: 'ranking_viewed',
  qrOpened: 'qr_opened',
  matchResultSubmitted: 'match_result_submitted',
  copaPareSubmitted: 'copa_pare_submitted',
  actionFailed: 'action_failed',
  permissionDenied: 'permission_denied',
  syncFailed: 'sync_failed',
  scoreFailed: 'score_failed',
  hostAssumed: 'host_assumed',
  roomLiveStatusChanged: 'room_live_status_changed',
  roomLiveFallbackPoll: 'room_live_fallback_poll',
  roomLiveChannelError: 'room_live_channel_error',
  // Funnel tracking
  landingViewed: 'landing_viewed',
  landingCreateRoomClicked: 'landing_create_room_clicked',
  landingJoinClicked: 'landing_join_clicked',
  roomInviteViewed: 'room_invite_viewed',
  predictionDeadlineViewed: 'prediction_deadline_viewed',
} as const

export type AnalyticsEventName =
  (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS]
