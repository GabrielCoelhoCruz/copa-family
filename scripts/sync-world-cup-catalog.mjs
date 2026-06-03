/**
 * Seed/refresh World Cup catalog in Supabase (teams, venues, fixtures).
 * Usage: node scripts/sync-world-cup-catalog.mjs [--provider=thesportsdb] [--mode=catalog]
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, value] = arg.replace(/^--/, '').split('=')
    return [key, value ?? 'true']
  })
)

const provider = args.provider ?? process.env.FIXTURE_SYNC_PROVIDER ?? 'thesportsdb'
const mode = args.mode ?? 'catalog'
const baseUrl = process.env.SYNC_BASE_URL ?? 'http://localhost:3000'
const token = process.env.FIXTURE_SYNC_TOKEN

if (!token) {
  console.error('Set FIXTURE_SYNC_TOKEN in .env.local')
  process.exit(1)
}

const response = await fetch(`${baseUrl}/api/admin/fixtures/sync`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ provider, mode }),
})

const body = await response.json()
console.log(JSON.stringify(body, null, 2))
if (!response.ok) process.exit(1)
