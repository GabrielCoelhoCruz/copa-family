/**
 * Copies Impeccable's frontend-design skill into the project (Windows-safe).
 * Source: impeccable bundle skill (Apache 2.0). Run after design:install or standalone.
 */

import { existsSync, mkdirSync, rmSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

const SOURCE_CANDIDATES = [
  join(
    process.env.USERPROFILE ?? '',
    '.claude',
    'plugins',
    'cache',
    'impeccable',
    'impeccable',
    '1.0.0',
    'source',
    'skills',
    'frontend-design'
  ),
  join(projectRoot, '.cursor', 'skills', 'impeccable', '..', 'frontend-design'),
]

const TARGETS = [
  join(projectRoot, '.cursor', 'skills', 'frontend-design'),
  join(projectRoot, '.agents', 'skills', 'frontend-design'),
]

async function main() {
  const force = process.argv.includes('--force')
  const src = SOURCE_CANDIDATES.find((path) => existsSync(join(path, 'SKILL.md')))

  if (!src) {
    console.error('frontend-design skill não encontrada nos caminhos conhecidos.')
    console.error('Instale Impeccable primeiro: npm run design:install')
    process.exit(1)
  }

  for (const dest of TARGETS) {
    if (existsSync(join(dest, 'SKILL.md')) && !force) {
      console.log(`Já instalada: ${dest}`)
      continue
    }
    mkdirSync(dirname(dest), { recursive: true })
    rmSync(dest, { recursive: true, force: true })
    await cp(src, dest, { recursive: true })
    console.log(`Instalada: ${dest}`)
  }

  console.log('Recarregue o Cursor. Use com PRODUCT.md + DESIGN.md + Impeccable layout.')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
