import { expect, test } from '@playwright/test'

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'
import {
  goToPalpitesTab,
  goToRankingTab,
  joinRoom,
  openPalpitesAsHost,
  selectFirstFixtureIfPresent,
  submitBasicPrediction,
} from './helpers'

test.describe('ranking', () => {
  test.skip(!hasE2EEnv, E2E_ENV_SKIP_MESSAGE)

  test('empate e nome longo no ranking', async ({ browser }) => {
    test.setTimeout(120_000)
    const stamp = Date.now()
    const longName = `Nome Bem Longo P/ Ranking ${stamp}`.slice(0, 40)
    const guestName = `Outro ${stamp}`

    const hostContext = await browser.newContext()
    const guestContext = await browser.newContext()
    const hostPage = await hostContext.newPage()
    const guestPage = await guestContext.newPage()

    try {
      await hostPage.goto('/criar-sala')
      await hostPage.getByLabel('Seu nome').fill(longName)
      await hostPage.getByLabel('Nome da sala').fill(`Empate ${stamp}`)
      await selectFirstFixtureIfPresent(hostPage)
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, {
        timeout: 30_000,
      })

      const roomCode = hostPage.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      await openPalpitesAsHost(hostPage)

      await joinRoom(guestPage, { code: roomCode!, name: guestName })
      await expect(guestPage).toHaveURL(new RegExp(`/sala/${roomCode}`, 'i'), {
        timeout: 30_000,
      })

      for (const page of [hostPage, guestPage]) {
        await goToPalpitesTab(page)
        await expect(page).toHaveURL(/\/palpites/)
        await submitBasicPrediction(page, {
          homeScore: '1',
          awayScore: '0',
        })
        await expect(
          page.getByRole('status').filter({ hasText: 'Palpite salvo' })
        ).toBeVisible({ timeout: 20_000 })
      }

      await goToRankingTab(hostPage)
      await expect(hostPage.locator(`[title="${longName}"]`).first()).toBeVisible()
      await expect(hostPage.getByText(guestName).first()).toBeVisible()
      await expect(
        hostPage.getByLabel('Ranking da sala').getByText('10 pts', { exact: true })
      ).toHaveCount(2)
    } finally {
      await hostContext.close()
      await guestContext.close()
    }
  })
})
