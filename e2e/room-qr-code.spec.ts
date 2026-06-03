import { expect, test } from '@playwright/test'

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'
import { selectFirstFixtureIfPresent } from './helpers'

test.describe('QR Code do convite', () => {
  test.skip(!hasE2EEnv, E2E_ENV_SKIP_MESSAGE)

  test('abre diálogo com imagem do QR após criar sala', async ({ page }) => {
    const stamp = Date.now()

    await page.goto('/criar-sala')
    await page.getByLabel('Seu nome').fill(`QR ${stamp}`)
    await page.getByLabel('Nome da sala').fill(`QR sala ${stamp}`)
    await selectFirstFixtureIfPresent(page)
    await page.getByRole('button', { name: 'Criar sala' }).click()

    await expect(page).toHaveURL(/\/sala\/[A-Z0-9]{6}/i, { timeout: 30_000 })
    await expect(page.getByText('Código da sala')).toBeVisible()

    await page.getByTestId('toggle-room-qr').click()
    await expect(page).toHaveURL(/\?qr=1/)

    const dialog = page.getByTestId('room-qr-dialog')
    await expect(dialog).toBeVisible({ timeout: 15_000 })
    await expect(
      dialog.getByRole('img', { name: /QR Code do link de convite/i })
    ).toBeVisible({ timeout: 10_000 })
    await expect(dialog.getByText(/\/entrar\?code=/i)).toBeVisible()
  })
})
