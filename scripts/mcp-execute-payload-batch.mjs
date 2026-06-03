/**
 * Prints one line: batch index and JSON args for execute_sql (stdout).
 * Usage: node mcp-execute-payload-batch.mjs <0-7>
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const i = Number(process.argv[2])
const dir = path.dirname(fileURLToPath(import.meta.url))
const payload = JSON.parse(
  fs.readFileSync(path.join(dir, `mcp-payload-${i}.json`), 'utf8')
)
process.stdout.write(JSON.stringify(payload))
