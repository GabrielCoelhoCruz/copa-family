/**
 * Run catalog sync directly. Usage: node scripts/run-catalog-sync.mjs
 */
import { config } from 'dotenv'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
config({ path: path.join(root, '.env.local') })

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'RAPIDAPI_WC26_KEY',
]

const missing = required.filter((name) => !process.env[name]?.trim())
if (missing.length > 0) {
  console.error('Missing in .env.local:', missing.join(', '))
  process.exit(1)
}

const mod = await import(
  pathToFileURL(path.join(root, 'src/features/fixtures/sync-world-cup-catalog.ts')).href
)

try {
  const result = await mod.syncWorldCupCatalog({
    provider: 'wc26-rapidapi',
    mode: 'catalog',
  })
  console.log(JSON.stringify(result, null, 2))
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
