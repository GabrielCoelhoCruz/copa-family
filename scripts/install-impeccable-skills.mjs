/**
 * Installs Impeccable agent skills into .cursor/skills (Windows-safe).
 * Official `impeccable skills install` uses `unzip`, which is often missing on Windows.
 *
 * Usage: node scripts/install-impeccable-skills.mjs [--force]
 */

import { execSync } from 'node:child_process'
import { createWriteStream, existsSync, mkdirSync, rmSync } from 'node:fs'
import { cp } from 'node:fs/promises'
import { get } from 'node:https'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_BASE = 'https://impeccable.style'
const BUNDLE_URL = `${API_BASE}/api/download/bundle/universal`
const PROVIDER = '.cursor'
const SKILL_NAME = 'impeccable'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

function findProjectRoot() {
  let dir = projectRoot
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir
    dir = dirname(dir)
  }
  return projectRoot
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        downloadFile(res.headers.location, dest).then(resolve).catch(reject)
        return
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Download failed: HTTP ${res.statusCode}`))
        return
      }
      const file = createWriteStream(dest)
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
      file.on('error', reject)
    }).on('error', reject)
  })
}

function extractZip(zipPath, destDir) {
  mkdirSync(destDir, { recursive: true })
  if (process.platform === 'win32') {
    const escapedZip = zipPath.replace(/'/g, "''")
    const escapedDest = destDir.replace(/'/g, "''")
    execSync(
      `powershell -NoProfile -Command "Expand-Archive -Path '${escapedZip}' -DestinationPath '${escapedDest}' -Force"`,
      { stdio: 'inherit' }
    )
    return
  }
  execSync(`unzip -qo "${zipPath}" -d "${destDir}"`, { encoding: 'utf8' })
}

async function main() {
  const force = process.argv.includes('--force')
  const root = findProjectRoot()
  const destSkill = join(root, PROVIDER, 'skills', SKILL_NAME)

  if (existsSync(join(destSkill, 'SKILL.md')) && !force) {
    console.log(`Impeccable já instalado em ${PROVIDER}/skills/${SKILL_NAME}/`)
    console.log('Use --force para reinstalar.')
    return
  }

  const tmpZip = join(tmpdir(), `impeccable-bundle-${Date.now()}.zip`)
  const tmpDir = join(tmpdir(), `impeccable-bundle-${Date.now()}`)

  console.log('Baixando bundle Impeccable...')
  await downloadFile(BUNDLE_URL, tmpZip)

  console.log('Extraindo...')
  extractZip(tmpZip, tmpDir)

  const srcSkill = join(tmpDir, PROVIDER, 'skills', SKILL_NAME)
  if (!existsSync(join(srcSkill, 'SKILL.md'))) {
    rmSync(tmpZip, { force: true })
    rmSync(tmpDir, { recursive: true, force: true })
    throw new Error(`Variante ${PROVIDER} não encontrada no bundle.`)
  }

  mkdirSync(join(root, PROVIDER, 'skills'), { recursive: true })
  rmSync(destSkill, { recursive: true, force: true })
  await cp(srcSkill, destSkill, { recursive: true })

  rmSync(tmpZip, { force: true })
  rmSync(tmpDir, { recursive: true, force: true })

  console.log(`Instalado: ${join(PROVIDER, 'skills', SKILL_NAME)}/`)
  console.log('Recarregue o Cursor e use /impeccable no chat.')
  console.log('Contexto do projeto: PRODUCT.md + DESIGN.md (init já feito manualmente).')
}

main().catch((error) => {
  console.error(error.message ?? error)
  process.exit(1)
})
