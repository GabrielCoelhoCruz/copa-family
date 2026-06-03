import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const inputPath = path.join(__dirname, '../.tmp-fixtures.json')
const seasonOverride = process.env.WORLD_CUP_SEASON
  ? Number(process.env.WORLD_CUP_SEASON)
  : null

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

function sqlString(value) {
  if (value == null) return 'null'
  return `'${String(value).replace(/'/g, "''")}'`
}

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf8'))
const fixtures = raw.response ?? []
const syncedAt = new Date().toISOString()

if (fixtures.length === 0) {
  console.error('No fixtures in input. Errors:', raw.errors)
  process.exit(1)
}

const rows = fixtures.map((item) => {
  const round = item.league.round ?? null
  const season = seasonOverride ?? item.league.season
  return {
    provider_fixture_id: item.fixture.id,
    league_id: item.league.id,
    season,
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
    raw: JSON.stringify(item),
  }
})

const batchSize = 8
for (let i = 0; i < rows.length; i += batchSize) {
  const batch = rows.slice(i, i + batchSize)
  const values = batch
    .map(
      (r) =>
        `('api-football', ${r.provider_fixture_id}, ${r.league_id}, ${r.season}, ${sqlString(r.round)}, ${sqlString(r.stage)}, ${sqlString(r.group_name)}, ${sqlString(r.kickoff_at)}, ${sqlString(r.status_short)}, ${sqlString(r.status_long)}, ${r.elapsed ?? 'null'}, ${sqlString(r.venue_name)}, ${sqlString(r.venue_city)}, ${r.home_team_id ?? 'null'}, ${sqlString(r.home_team_name)}, ${sqlString(r.home_team_logo)}, ${r.away_team_id ?? 'null'}, ${sqlString(r.away_team_name)}, ${sqlString(r.away_team_logo)}, ${r.home_goals ?? 'null'}, ${r.away_goals ?? 'null'}, ${sqlString(r.raw)}::jsonb, ${sqlString(syncedAt)})`
    )
    .join(',\n')

  const sql = `insert into public.football_fixtures (
  provider, provider_fixture_id, league_id, season, round, stage, group_name,
  kickoff_at, status_short, status_long, elapsed, venue_name, venue_city,
  home_team_id, home_team_name, home_team_logo, away_team_id, away_team_name, away_team_logo,
  home_goals, away_goals, raw, last_synced_at
) values
${values}
on conflict (provider, provider_fixture_id) do update set
  league_id = excluded.league_id,
  season = excluded.season,
  round = excluded.round,
  stage = excluded.stage,
  group_name = excluded.group_name,
  kickoff_at = excluded.kickoff_at,
  status_short = excluded.status_short,
  status_long = excluded.status_long,
  elapsed = excluded.elapsed,
  venue_name = excluded.venue_name,
  venue_city = excluded.venue_city,
  home_team_id = excluded.home_team_id,
  home_team_name = excluded.home_team_name,
  home_team_logo = excluded.home_team_logo,
  away_team_id = excluded.away_team_id,
  away_team_name = excluded.away_team_name,
  away_team_logo = excluded.away_team_logo,
  home_goals = excluded.home_goals,
  away_goals = excluded.away_goals,
  raw = excluded.raw,
  last_synced_at = excluded.last_synced_at;`

  process.stdout.write(`---BATCH ${i / batchSize}---\n`)
  process.stdout.write(`${sql}\n`)
}

process.stderr.write(
  `Generated ${rows.length} fixtures in ${Math.ceil(rows.length / batchSize)} batches\n`
)
