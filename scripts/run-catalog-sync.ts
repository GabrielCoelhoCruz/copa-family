/**
 * Run catalog sync directly (no dev server). Loads .env.local via dotenv.
 * Usage: npx tsx scripts/run-catalog-sync.ts
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAPIDAPI_WC26_KEY',
] as const

for (const name of required) {
  if (!process.env[name]?.trim()) {
    console.error(`Missing ${name} in .env.local`)
    process.exit(1)
  }
}

const { syncWorldCupCatalog } = await import(
  '../src/features/fixtures/sync-world-cup-catalog'
)

try {
  const result = await syncWorldCupCatalog({
    provider: 'wc26-rapidapi',
    mode: 'catalog',
  })
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
