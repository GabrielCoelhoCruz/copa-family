/**
 * One-off: upsert fixtures using service role from .env.local
 * Usage: node scripts/seed-fixtures-from-files.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

config({ path: path.join(root, '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local'
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  let total = 0
  for (let i = 0; i < 8; i += 1) {
    const sqlPath = path.join(root, `batch-${i}.sql`)
    const sql = fs.readFileSync(sqlPath, 'utf8')
    const { error } = await supabase.rpc('exec_sql', { query: sql })
    if (error) {
      // rpc may not exist — use REST SQL via postgrest not available
      console.error('Batch', i, 'failed:', error.message)
      process.exit(1)
    }
    total += 1
    console.log('Batch', i, 'ok')
  }
  console.log('Done', total, 'batches')
}

main()
