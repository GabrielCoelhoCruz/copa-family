import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const skillMd = join(root, '.cursor', 'skills', 'impeccable', 'SKILL.md')

if (!existsSync(skillMd)) {
  console.error('Impeccable skill não instalada.')
  console.error('Execute: npm run design:install')
  process.exit(1)
}

console.log('Impeccable skill instalada em .cursor/skills/impeccable/')
console.log('Recarregue o Cursor e use /impeccable no chat.')
