import { expect, test } from '@playwright/test'

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'
import {
  goToJogoTab,
  goToPalpitesTab,
  joinRoom,
  openPalpitesAsHost,
  selectFirstFixtureIfPresent,
  submitBasicPrediction,
  expectPredictionSaved,
} from './helpers'

test.describe('sala ao vivo', () => {
  test.skip(!hasE2EEnv, E2E_ENV_SKIP_MESSAGE)

  test('convidado vê status e Copa Stop sem recarregar', async ({ browser }) => {
    test.setTimeout(180_000)
    const stamp = Date.now()
    const hostName = `Host Live ${stamp}`
    const guestName = `Guest Live ${stamp}`
    const roomName = `Live ${stamp}`

    const hostContext = await browser.newContext()
    const guestContext = await browser.newContext()
    const hostPage = await hostContext.newPage()
    const guestPage = await guestContext.newPage()

    try {
      await hostPage.goto('/criar-sala')
      await hostPage.getByLabel('Seu nome').fill(hostName)
      await hostPage.getByLabel('Nome da sala').fill(roomName)
      await selectFirstFixtureIfPresent(hostPage)
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, { timeout: 30_000 })

      const roomCode = hostPage.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      await joinRoom(guestPage, { code: roomCode!, name: guestName })
      await expect(guestPage).toHaveURL(new RegExp(`/sala/${roomCode}`, 'i'), {
        timeout: 30_000,
      })

      await goToJogoTab(guestPage)

      await openPalpitesAsHost(hostPage)
      await expect(
        guestPage.getByLabel('Status da partida: Palpites abertos').first()
      ).toBeVisible({ timeout: 20_000 })

      await goToPalpitesTab(guestPage)
      await submitBasicPrediction(guestPage)
      await expectPredictionSaved(guestPage)

      await goToPalpitesTab(hostPage)
      await submitBasicPrediction(hostPage)
      await expectPredictionSaved(hostPage)
      await goToJogoTab(hostPage)

      await expect(hostPage.getByRole('button', { name: 'Iniciar jogo' })).toBeVisible({
        timeout: 30_000,
      })
      await hostPage.getByRole('button', { name: 'Iniciar jogo' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Ao vivo').first()
      ).toBeVisible({ timeout: 20_000 })

      await goToJogoTab(guestPage)

      await hostPage.getByRole('button', { name: 'Abrir intervalo' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Intervalo').first()
      ).toBeVisible({ timeout: 20_000 })

      await expect(
        guestPage.getByRole('region', { name: 'Copa Pare disponível' })
      ).toBeVisible({ timeout: 20_000 })
    } finally {
      await hostContext.close()
      await guestContext.close()
    }
  })
})
