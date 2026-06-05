import { NextResponse } from 'next/server'

import { trackEvent, type AnalyticsEventName } from '@/lib/analytics'
import { getGuestUserId } from '@/lib/session'

type TrackBody = {
  eventName: AnalyticsEventName
  roomId?: string
  matchId?: string
  metadata?: Record<string, unknown>
}

export async function POST(request: Request) {
  let body: TrackBody
  try {
    body = (await request.json()) as TrackBody
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  if (!body.eventName || typeof body.eventName !== 'string') {
    return NextResponse.json({ error: 'Missing eventName' }, { status: 400 })
  }

  const userId = await getGuestUserId()

  await trackEvent({
    eventName: body.eventName,
    roomId: body.roomId,
    matchId: body.matchId,
    userId: userId ?? undefined,
    metadata: body.metadata,
  })

  return NextResponse.json({ ok: true })
}
