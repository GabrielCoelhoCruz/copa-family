import { NextResponse } from 'next/server'
import { z } from 'zod'

import { syncWorldCupCatalog } from '@/features/fixtures/sync-world-cup-catalog'
import { ANALYTICS_EVENTS, trackFailureEvent } from '@/lib/analytics'
import { getFixtureSyncToken } from '@/lib/env'

const syncBodySchema = z.object({
  provider: z.enum(['thesportsdb', 'api-football', 'wc26-rapidapi']).optional(),
  mode: z.enum(['catalog', 'fixtures', 'scores']).optional(),
  season: z.coerce.number().int().optional(),
})

function isAuthorized(request: Request): boolean {
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Bearer ')) return false
  const token = auth.slice('Bearer '.length).trim()
  try {
    return token === getFixtureSyncToken()
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (process.env.ENABLE_ADMIN_METRICS !== 'true') {
    return NextResponse.json({ error: 'Admin disabled' }, { status: 404 })
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: z.infer<typeof syncBodySchema> = {}
  try {
    const text = await request.text()
    if (text.trim()) {
      body = syncBodySchema.parse(JSON.parse(text))
    }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    const result = await syncWorldCupCatalog({
      provider: body.provider,
      mode: body.mode,
      season: body.season,
    })
    return NextResponse.json(result)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Fixture sync failed'
    await trackFailureEvent({
      eventName: ANALYTICS_EVENTS.syncFailed,
      action: 'fixture_sync',
      reason: message,
    })
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
