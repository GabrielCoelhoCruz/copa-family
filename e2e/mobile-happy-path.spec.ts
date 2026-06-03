import { expect, test } from '@playwright/test'

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'
import {
  goToPalpitesTab,
  goToRankingTab,
  openPalpitesAsHost,
  selectFirstFixtureIfPresent,
  submitBasicPrediction,
} from './helpers'

test.describe('fluxo mobile 390px', () => {
  test.skip(!hasE2EEnv, E2E_ENV_SKIP_MESSAGE)

  test('criar sala → abrir palpites → enviar → ranking 10 pts', async ({
    page,
  }) => {
    const stamp = Date.now()
    const displayName = `E2E ${stamp}`
    const roomName = `Sala teste ${stamp}`

    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Copa Family' })).toBeVisible()

    await page.getByRole('link', { name: 'Criar sala' }).click()
    await expect(page).toHaveURL(/\/criar-sala/)

    await page.getByLabel('Seu nome').fill(displayName)
    await page.getByLabel('Nome da sala').fill(roomName)
    await selectFirstFixtureIfPresent(page)
    await page.getByRole('button', { name: 'Criar sala' }).click()

    await expect(page).toHaveURL(/\/sala\/[A-Z0-9]{6}/i, { timeout: 30_000 })
    await expect(page.getByText('Código da sala')).toBeVisible()

    await page.getByTestId('toggle-room-qr').click()
    await expect(page).toHaveURL(/\?qr=1/)
    await expect(page.getByTestId('room-qr-dialog')).toBeVisible({ timeout: 15_000 })
    await expect(
      page.getByRole('img', { name: /QR Code do link de convite/i })
    ).toBeVisible({ timeout: 15_000 })

    await openPalpitesAsHost(page)

    await goToPalpitesTab(page)
    await expect(page).toHaveURL(/\/palpites/)

    await submitBasicPrediction(page)

    await expect(
      page.getByRole('status').filter({ hasText: 'Palpite salvo' })
    ).toBeVisible({ timeout: 20_000 })

    await goToRankingTab(page)
    await expect(page).toHaveURL(/\/ranking/)
    await expect(
      page.getByLabel('Ranking da sala').getByText('10 pts', { exact: true })
    ).toBeVisible()
    await expect(
      page.getByLabel('Ranking da sala').getByText(displayName)
    ).toBeVisible()
  })
})
