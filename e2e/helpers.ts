import { expect, type Page } from '@playwright/test'

/** Required when the create-room form lists synced Copa fixtures. */
export async function selectFirstFixtureIfPresent(page: Page) {
  const fixtureRadio = page.locator('input[name="fixtureId"]').first()
  if ((await fixtureRadio.count()) > 0) {
    await fixtureRadio.check()
  }
}

function salaNav(page: Page) {
  return page.getByRole('navigation', { name: 'Navegação da sala' })
}

/** Bottom tab "Palpite" (aria-label Palpites), not hero CTA "Fazer palpite". */
export async function goToPalpitesTab(page: Page) {
  await salaNav(page).getByRole('link', { name: 'Palpites' }).click()
}

export async function goToRankingTab(page: Page) {
  await salaNav(page).getByRole('link', { name: 'Ranking' }).click()
}

export async function goToJogoTab(page: Page) {
  await salaNav(page).getByRole('link', { name: 'Jogo' }).click()
}

export async function goToPerfilTab(page: Page) {
  await salaNav(page).getByRole('link', { name: 'Perfil' }).click()
}

export async function openPalpitesAsHost(page: Page) {
  await page.getByRole('button', { name: 'Abrir palpites' }).click()
  await expect(
    page.getByLabel('Status da partida: Palpites abertos').first()
  ).toBeVisible({ timeout: 20_000 })
}

export async function joinRoom(
  page: Page,
  input: { code: string; name: string }
) {
  await page.goto(`/entrar?code=${input.code}`)
  await page.getByLabel('Seu nome').fill(input.name)
  await page.getByRole('button', { name: 'Entrar na sala' }).click()
}

/** After saving a prediction, return to the sala game board tab. */
export async function leavePalpitesSuccess(page: Page, roomCode: string) {
  const voltar = page.getByRole('link', { name: 'Voltar ao jogo' })
  if (await voltar.isVisible()) {
    await voltar.click()
  } else {
    await goToJogoTab(page)
  }
  await expect(page).toHaveURL(new RegExp(`/sala/${roomCode}(?:\\?|$)`, 'i'), {
    timeout: 20_000,
  })
}

export async function expectPredictionSaved(page: Page) {
  await expect(
    page.getByRole('status').filter({ hasText: 'Palpite salvo' })
  ).toBeVisible({ timeout: 20_000 })
}

type PredictionInput = {
  winnerIndex?: number
  winnerText?: string
  homeScore?: string
  awayScore?: string
  player?: string
}

export async function submitBasicPrediction(page: Page, input: PredictionInput = {}) {
  const {
    winnerIndex = 0,
    homeScore = '2',
    awayScore = '1',
    player = 'Neymar',
  } = input

  await expect(page.getByRole('button', { name: /Salvar palpite/ })).toBeVisible({
    timeout: 20_000,
  })

  const predictionForm = page
    .locator('form')
    .filter({ has: page.getByRole('button', { name: /Salvar palpite/ }) })
  const winnerRadios = predictionForm.locator('input[name="winner"]')
  const winnerTextInput = predictionForm.locator('#winner')

  await expect(winnerRadios.first().or(winnerTextInput)).toBeVisible({
    timeout: 20_000,
  })

  if ((await winnerRadios.count()) > 0) {
    const index = Math.min(winnerIndex, (await winnerRadios.count()) - 1)
    await winnerRadios.nth(index).check()
  } else {
    const winnerText = input.winnerText?.trim()
    if (!winnerText) {
      throw new Error(
        'submitBasicPrediction: provide winnerText when the match has no fixture radios'
      )
    }
    await winnerTextInput.fill(winnerText)
  }

  await predictionForm.locator('#homeScore').fill(homeScore)
  await predictionForm.locator('#awayScore').fill(awayScore)
  const playerChip = predictionForm.getByRole('button', { name: player, exact: true })
  if ((await playerChip.count()) > 0) {
    await playerChip.click()
  } else {
    await predictionForm.locator('#playerOfMatch').fill(player)
  }
  await page.getByRole('button', { name: /Salvar palpite/ }).click()
}

export async function winnerOptionAt(page: Page, index = 0) {
  const predictionForm = page
    .locator('form')
    .filter({ has: page.getByRole('button', { name: /Salvar palpite/ }) })
  const radio = predictionForm.locator('input[name="winner"]').nth(index)
  const value = await radio.getAttribute('value')
  if (!value) {
    throw new Error('Winner option not found on prediction form')
  }
  return value
}

export async function goToCopaPare(page: Page, roomCode: string) {
  await page.goto(`/sala/${roomCode}/copa-pare`)
}

export async function submitCopaPareAnswer(page: Page, answer: string) {
  await page.getByLabel('Sua resposta').fill(answer)
  await page.getByRole('button', { name: /Confirmar Copa Stop/ }).click()
}

export async function submitMatchResult(
  page: Page,
  input: { winner: string; home: string; away: string; player: string }
) {
  await page.locator('#winner').fill(input.winner)
  await page.locator('#homeScore').fill(input.home)
  await page.locator('#awayScore').fill(input.away)
  await page.locator('#playerOfMatch').fill(input.player)
  await page.getByRole('button', { name: /Salvar resultado/ }).click()
}
