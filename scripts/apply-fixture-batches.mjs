/**
 * Prints each batch SQL file separated by markers for MCP execute_sql.
 * Run: node scripts/apply-fixture-batches.mjs > batches-for-mcp.txt
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

for (let i = 0; i < 8; i += 1) {
  const sql = fs.readFileSync(path.join(root, `batch-${i}.sql`), 'utf8').trim()
  process.stdout.write(`@@BATCH_${i}@@\n${sql}\n`)
}
