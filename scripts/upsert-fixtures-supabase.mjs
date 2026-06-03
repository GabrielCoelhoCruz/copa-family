/**
 * Upsert fixtures from .tmp-fixtures.json into Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const apiKey = process.env.API_FOOTBALL_KEY
const seasonOverride = Number(process.env.WORLD_CUP_SEASON ?? 2026)
const apiSeason = Number(process.env.API_FOOTBALL_FETCH_SEASON ?? 2022)

if (!url || !serviceKey) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}
if (!apiKey) {
  console.error('Set API_FOOTBALL_KEY in .env.local')
  process.exit(1)
}

function parseGroupFromRound(round) {
  if (!round) return null
  const groupMatch = round.match(/Group\s+([A-H])\b/i)
  return groupMatch ? `Grupo ${groupMatch[1].toUpperCase()}` : null
}

function parseStageFromRound(round) {
  if (!round) return null
  if (/group/i.test(round)) return 'Fase de grupos'
  if (/round of 16|1\/8|oitavas/i.test(round)) return 'Oitavas'
  if (/quarter|1\/4|quartas/i.test(round)) return 'Quartas'
  if (/semi|1\/2|semifinal/i.test(round)) return 'Semifinal'
  if (/3rd|third place|terceiro/i.test(round)) return '3º lugar'
  if (/final/i.test(round) && !/semi|quarter|round/i.test(round)) return 'Final'
  return round
}

function mapItem(item, syncedAt) {
  const round = item.league.round ?? null
  return {
    provider: 'api-football',
    provider_fixture_id: item.fixture.id,
    league_id: item.league.id,
    season: seasonOverride,
    round,
    stage: parseStageFromRound(round),
    group_name: parseGroupFromRound(round),
    kickoff_at: item.fixture.date,
    status_short: item.fixture.status.short,
    status_long: item.fixture.status.long,
    elapsed: item.fixture.status.elapsed,
    venue_name: item.fixture.venue?.name ?? null,
    venue_city: item.fixture.venue?.city ?? null,
    home_team_id: item.teams.home.id,
    home_team_name: item.teams.home.name,
    home_team_logo: item.teams.home.logo,
    away_team_id: item.teams.away.id,
    away_team_name: item.teams.away.name,
    away_team_logo: item.teams.away.logo,
    home_goals: item.goals.home,
    away_goals: item.goals.away,
    raw: item,
    last_synced_at: syncedAt,
  }
}

async function fetchFixtures() {
  const fetchUrl = new URL('https://v3.football.api-sports.io/fixtures')
  fetchUrl.searchParams.set('league', '1')
  fetchUrl.searchParams.set('season', String(apiSeason))

  const response = await fetch(fetchUrl, {
    headers: { 'x-apisports-key': apiKey },
  })
  const data = await response.json()
  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors))
  }
  return data.response ?? []
}

async function main() {
  const syncedAt = new Date().toISOString()
  let items

  const cachePath = path.join(root, '.tmp-fixtures.json')
  if (fs.existsSync(cachePath)) {
    const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'))
    if ((cached.response?.length ?? 0) > 0) {
      items = cached.response
      console.error(`Using cached ${items.length} fixtures from .tmp-fixtures.json`)
    }
  }

  if (!items?.length) {
    items = await fetchFixtures()
    console.error(`Fetched ${items.length} fixtures (API season ${apiSeason})`)
  }

  const rows = items.map((item) => mapItem(item, syncedAt))
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const chunkSize = 20
  let upserted = 0
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    const { error } = await supabase
      .from('football_fixtures')
      .upsert(chunk, { onConflict: 'provider,provider_fixture_id' })
    if (error) {
      console.error('Upsert failed:', error.message)
      process.exit(1)
    }
    upserted += chunk.length
    console.error(`Upserted ${upserted}/${rows.length}`)
  }

  console.log(JSON.stringify({ ok: true, upserted, season: seasonOverride, apiSeason }))
}

main()
