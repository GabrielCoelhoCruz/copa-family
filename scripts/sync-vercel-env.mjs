/**
 * Push selected keys from .env.local to Vercel (production + preview).
 * Usage: node scripts/sync-vercel-env.mjs
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAPIDAPI_WC26_KEY',
  'FIXTURE_SYNC_PROVIDER',
  'WORLD_CUP_SEASON',
  'FIXTURE_SYNC_TOKEN',
  'THESPORTSDB_API_KEY',
  'API_FOOTBALL_KEY',
  'ENABLE_ADMIN_METRICS',
]

const SENSITIVE = new Set([
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAPIDAPI_WC26_KEY',
  'FIXTURE_SYNC_TOKEN',
  'THESPORTSDB_API_KEY',
  'API_FOOTBALL_KEY',
])

const ENVIRONMENTS = [['production']]

function runVercel(args) {
  return spawnSync('npx', ['vercel', ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: true,
  })
}

let synced = 0
let skipped = 0

for (const key of KEYS) {
  const value = process.env[key]?.trim()
  if (!value) {
    skipped += 1
    continue
  }

  for (const target of ENVIRONMENTS) {
    const args = [
      'env',
      'add',
      key,
      ...target,
      '--force',
      '--yes',
      '--value',
      value,
      ...(SENSITIVE.has(key) ? ['--sensitive'] : []),
    ]
    const result = runVercel(args)
    if (result.status !== 0) {
      const err = (result.stderr || result.stdout || '').trim()
      console.error(`Failed ${key} (${target.join('/')}):`, err.slice(0, 300))
      process.exit(1)
    }
    synced += 1
    console.log(`OK ${key} → ${target.join('/')}`)
  }
}

console.log(`Done. ${synced} variable targets set, ${skipped} keys missing locally.`)
