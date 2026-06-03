import { expect, test } from '@playwright/test'

import { E2E_ENV_SKIP_MESSAGE, hasE2EEnv } from './env'
import {
  goToCopaPare,
  goToJogoTab,
  goToPalpitesTab,
  goToPerfilTab,
  goToRankingTab,
  expectPredictionSaved,
  joinRoom,
  leavePalpitesSuccess,
  openPalpitesAsHost,
  selectFirstFixtureIfPresent,
  submitBasicPrediction,
  submitCopaPareAnswer,
  submitMatchResult,
  winnerOptionAt,
} from './helpers'

test.describe('multiusuário', () => {
  test.skip(!hasE2EEnv, E2E_ENV_SKIP_MESSAGE)

  test('anfitrião conduz dois convidados até resultado e perfil', async ({
    browser,
  }) => {
    test.setTimeout(240_000)
    const stamp = Date.now()
    const hostName = `Host ${stamp}`
    const guestName = `Convidado A ${stamp}`
    const secondGuestName = `Convidado B ${stamp}`
    const roomName = `Família ${stamp}`

    const hostContext = await browser.newContext()
    const guestContext = await browser.newContext()
    const secondGuestContext = await browser.newContext()
    const hostPage = await hostContext.newPage()
    const guestPage = await guestContext.newPage()
    const secondGuestPage = await secondGuestContext.newPage()

    try {
      await hostPage.goto('/criar-sala')
      await hostPage.getByLabel('Seu nome').fill(hostName)
      await hostPage.getByLabel('Nome da sala').fill(roomName)
      await selectFirstFixtureIfPresent(hostPage)
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, {
        timeout: 30_000,
      })

      const roomCode = hostPage.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      await openPalpitesAsHost(hostPage)

      await joinRoom(guestPage, { code: roomCode!, name: guestName })
      await expect(guestPage).toHaveURL(
        new RegExp(`/sala/${roomCode}`, 'i'),
        { timeout: 30_000 }
      )

      await joinRoom(secondGuestPage, {
        code: roomCode!,
        name: secondGuestName,
      })
      await expect(secondGuestPage).toHaveURL(
        new RegExp(`/sala/${roomCode}`, 'i'),
        { timeout: 30_000 }
      )

      await goToPalpitesTab(guestPage)
      await expect(guestPage).toHaveURL(/\/palpites/)
      await submitBasicPrediction(guestPage, {
        winnerIndex: 1,
        homeScore: '0',
        awayScore: '1',
        player: 'Messi',
      })
      await expectPredictionSaved(guestPage)

      await goToPalpitesTab(secondGuestPage)
      await expect(secondGuestPage).toHaveURL(/\/palpites/)
      await submitBasicPrediction(secondGuestPage)
      await expectPredictionSaved(secondGuestPage)

      await goToPalpitesTab(hostPage)
      await expect(hostPage).toHaveURL(/\/palpites/)
      const matchWinner = await winnerOptionAt(hostPage, 0)
      await submitBasicPrediction(hostPage)
      await expectPredictionSaved(hostPage)
      await leavePalpitesSuccess(hostPage, roomCode!)

      await expect(
        hostPage.getByRole('button', { name: 'Iniciar jogo' })
      ).toBeVisible({ timeout: 30_000 })
      await hostPage.getByRole('button', { name: 'Iniciar jogo' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Ao vivo').first()
      ).toBeVisible({ timeout: 20_000 })

      await hostPage.getByRole('button', { name: 'Abrir intervalo' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Intervalo').first()
      ).toBeVisible({ timeout: 20_000 })

      await goToCopaPare(guestPage, roomCode!)
      await submitCopaPareAnswer(guestPage, 'Neymar')
      await expect(guestPage.getByText('Você entrou no Copa Pare!')).toBeVisible({
        timeout: 20_000,
      })

      await hostPage.getByRole('button', { name: 'Encerrar partida' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Encerrado').first()
      ).toBeVisible({ timeout: 20_000 })
      await submitMatchResult(hostPage, {
        winner: matchWinner,
        home: '2',
        away: '1',
        player: 'Neymar',
      })
      await expect(hostPage.getByText('Resultado salvo')).toBeVisible({
        timeout: 20_000,
      })

      await goToRankingTab(hostPage)
      const salaRanking = hostPage.getByLabel('Ranking da sala')
      await expect(salaRanking.getByText(hostName)).toBeVisible()
      await expect(salaRanking.getByText(guestName)).toBeVisible()
      await expect(salaRanking.getByText(secondGuestName)).toBeVisible()
      await expect(salaRanking.getByText(/\d+ pts/).first()).toBeVisible()

      await goToPerfilTab(guestPage)
      await expect(
        guestPage.getByRole('heading', { name: 'Compartilhar meu placar' })
      ).toBeVisible()
    } finally {
      await hostContext.close()
      await guestContext.close()
      await secondGuestContext.close()
    }
  })
})
