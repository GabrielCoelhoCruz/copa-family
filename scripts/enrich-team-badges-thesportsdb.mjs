/**
 * Fill football_teams.badge_url from TheSportsDB searchteams (1 req per team).
 * Usage: node scripts/enrich-team-badges-thesportsdb.mjs
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const apiKey = process.env.THESPORTSDB_API_KEY ?? '3'
const season = Number(process.env.WORLD_CUP_SEASON ?? 2026)

if (!url || !serviceKey) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const PLACEHOLDER = /^1[A-L]$/i

async function searchTeamBadge(teamName) {
  const searchUrl = new URL(
    `https://www.thesportsdb.com/api/v1/json/${apiKey}/searchteams.php`
  )
  searchUrl.searchParams.set('t', teamName)

  const response = await fetch(searchUrl)
  if (!response.ok) return null

  const data = await response.json()
  const teams = data.teams ?? []
  if (teams.length === 0) return null

  const exact =
    teams.find(
      (t) => t.strTeam?.toLowerCase() === teamName.toLowerCase()
    ) ?? teams[0]

  const badge = exact.strBadge ?? exact.strTeamBadge ?? exact.strLogo ?? null
  if (!badge) return null

  return {
    badgeUrl: badge,
    thesportsdbId: exact.idTeam ?? null,
  }
}

const admin = createClient(url, serviceKey)
const { data: teams, error } = await admin
  .from('football_teams')
  .select('id, name, slug, badge_url')
  .eq('season', season)
  .order('name')

if (error) {
  console.error(error.message)
  process.exit(1)
}

const toEnrich = (teams ?? []).filter(
  (t) => !PLACEHOLDER.test(t.name.trim()) && !t.badge_url
)

console.log(`Enriching ${toEnrich.length} teams (TheSportsDB)...`)

let updated = 0
let missed = 0

for (const team of toEnrich) {
  const result = await searchTeamBadge(team.name)
  if (!result) {
    missed += 1
    console.log(`  miss: ${team.name}`)
    continue
  }

  const provider_refs = { thesportsdb: result.thesportsdbId ?? team.slug }
  const { error: updateError } = await admin
    .from('football_teams')
    .update({
      badge_url: result.badgeUrl,
      flag_url: result.badgeUrl,
      provider_refs,
      updated_at: new Date().toISOString(),
    })
    .eq('id', team.id)

  if (updateError) {
    console.error(`  fail ${team.name}:`, updateError.message)
    missed += 1
  } else {
    updated += 1
  }

  await new Promise((r) => setTimeout(r, 120))
}

console.log(JSON.stringify({ updated, missed, total: toEnrich.length }, null, 2))
