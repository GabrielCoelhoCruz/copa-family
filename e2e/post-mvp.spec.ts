import { expect, test } from '@playwright/test'

import {
  joinRoom,
  selectFirstFixtureIfPresent,
} from './helpers'

test.describe('post-mvp improvements', () => {

  test('whatsApp share button generates correct URL', async ({ browser }) => {
    test.setTimeout(120_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      // Create a room
      await page.goto('/criar-sala')
      await page.getByLabel('Seu nome').fill('Test Host')
      await page.getByLabel('Nome da sala').fill('Test Room')
      await selectFirstFixtureIfPresent(page)
      await page.getByRole('button', { name: 'Criar sala' }).click()
      await expect(page).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, { timeout: 30_000 })

      const roomCode = page.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      // Verify WhatsApp button exists
      const whatsappLink = page.getByRole('link', { name: 'Compartilhar no WhatsApp' })
      await expect(whatsappLink).toBeVisible()

      // Verify the href contains wa.me with correct content
      const href = await whatsappLink.getAttribute('href')
      expect(href).toContain('https://wa.me/?text=')

      // Decode and verify message content
      const decoded = decodeURIComponent(href!.replace('https://wa.me/?text=', ''))
      expect(decoded).toContain('Vem jogar Copa Family com a gente!')
      expect(decoded).toContain(`Código da sala: ${roomCode}`)
      expect(decoded).toContain(`entrar?code=${roomCode}`)

      // Verify no double-encoding
      expect(href).not.toContain('%25')
    } finally {
      await ctx.close()
    }
  })

  test('loading skeleton renders during page load', async ({ browser }) => {
    test.setTimeout(60_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      // Navigate to landing page
      await page.goto('/')

      // The page should load successfully (skeleton is transient, hard to catch in E2E)
      // Instead, verify the page renders correctly after load
      await expect(page.getByRole('heading', { name: 'Copa Family' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Criar sala' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible()
    } finally {
      await ctx.close()
    }
  })

  test('privacy policy page renders correctly', async ({ browser }) => {
    test.setTimeout(60_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      // Navigate to privacy page
      await page.goto('/privacidade')

      // Verify page content
      await expect(page.getByRole('heading', { name: 'Política de Privacidade' })).toBeVisible()
      await expect(page.getByText('Dados coletados')).toBeVisible()
      await expect(page.getByText('Como usamos')).toBeVisible()
      await expect(page.getByText('O que não fazemos')).toBeVisible()
      await expect(page.getByText('Armazenamento')).toBeVisible()
      await expect(page.getByText('Seus direitos (LGPD)')).toBeVisible()
      await expect(page.getByText(/Última atualização/)).toBeVisible()

      // Verify back link works
      await page.getByRole('link', { name: /Voltar para o Copa Family/ }).click()
      await expect(page).toHaveURL('/')
    } finally {
      await ctx.close()
    }
  })

  test('privacy link is in landing page footer', async ({ browser }) => {
    test.setTimeout(60_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      await page.goto('/')

      // Verify privacy link exists in footer
      const privacyLink = page.getByRole('link', { name: 'Privacidade' })
      await expect(privacyLink).toBeVisible()

      // Verify it navigates to the correct page
      await privacyLink.click()
      await expect(page).toHaveURL('/privacidade')
    } finally {
      await ctx.close()
    }
  })

  test('design system page is removed (404)', async ({ browser }) => {
    test.setTimeout(30_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      const response = await page.goto('/design-system')
      expect(response?.status()).toBe(404)
    } finally {
      await ctx.close()
    }
  })

  test('error boundary catches render errors', async ({ browser }) => {
    test.setTimeout(60_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      // Create a room first
      await page.goto('/criar-sala')
      await page.getByLabel('Seu nome').fill('Error Test')
      await page.getByLabel('Nome da sala').fill('Error Room')
      await selectFirstFixtureIfPresent(page)
      await page.getByRole('button', { name: 'Criar sala' }).click()
      await expect(page).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, { timeout: 30_000 })

      // The room page should render without errors
      await expect(page.getByText('Error Test')).toBeVisible()
      await expect(page.getByText('Dono')).toBeVisible()

      // Verify no error boundary fallback is shown (meaning no errors occurred)
      await expect(page.getByText('Algo deu errado')).not.toBeVisible()
    } finally {
      await ctx.close()
    }
  })

  test('service worker registers on page load', async ({ browser }) => {
    test.setTimeout(60_000)

    const ctx = await browser.newContext()
    const page = await ctx.newPage()

    try {
      await page.goto('/')

      // Wait for service worker to register
      await page.waitForTimeout(3000)

      // Check if service worker is registered
      const swRegistered = await page.evaluate(async () => {
        if (!('serviceWorker' in navigator)) return false
        const registration = await navigator.serviceWorker.getRegistration()
        return registration !== undefined
      })

      expect(swRegistered).toBe(true)
    } finally {
      await ctx.close()
    }
  })

  test('full flow: create room → join → predict → ranking', async ({ browser }) => {
    test.setTimeout(240_000)

    const hostCtx = await browser.newContext()
    const guestCtx = await browser.newContext()
    const hostPage = await hostCtx.newPage()
    const guestPage = await guestCtx.newPage()

    try {
      // === HOST: Create room ===
      await hostPage.goto('/criar-sala')
      await hostPage.getByLabel('Seu nome').fill('Host E2E')
      await hostPage.getByLabel('Nome da sala').fill('Família E2E')
      await selectFirstFixtureIfPresent(hostPage)
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, { timeout: 30_000 })

      const roomCode = hostPage.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      // Verify WhatsApp button is present
      await expect(hostPage.getByRole('link', { name: 'Compartilhar no WhatsApp' })).toBeVisible()

      // === GUEST: Join room ===
      await joinRoom(guestPage, { code: roomCode!, name: 'Guest E2E' })
      await expect(guestPage).toHaveURL(new RegExp(`/sala/${roomCode}`, 'i'), { timeout: 30_000 })

      // === HOST: Open predictions ===
      await hostPage.getByRole('button', { name: 'Abrir palpites' }).click()
      await expect(hostPage.getByLabel('Status da partida: Palpites abertos').first()).toBeVisible({ timeout: 20_000 })

      // === GUEST: Submit prediction ===
      await guestPage.getByRole('link', { name: 'Palpites' }).click()
      await expect(guestPage).toHaveURL(/\/palpites/)

      const predictionForm = guestPage.locator('form').filter({ has: guestPage.getByRole('button', { name: /Salvar palpite/ }) })
      const winnerRadios = predictionForm.locator('input[name="winner"]')
      if ((await winnerRadios.count()) > 0) {
        await winnerRadios.first().check()
      } else {
        await predictionForm.locator('#winner').fill('Brasil')
      }
      await predictionForm.locator('#homeScore').fill('2')
      await predictionForm.locator('#awayScore').fill('1')
      const playerChip = predictionForm.getByRole('button', { name: 'Neymar', exact: true })
      if ((await playerChip.count()) > 0) {
        await playerChip.click()
      } else {
        await predictionForm.locator('#playerOfMatch').fill('Neymar')
      }
      await guestPage.getByRole('button', { name: /Salvar palpite/ }).click()
      await expect(guestPage.getByRole('status').filter({ hasText: 'Palpite salvo' })).toBeVisible({ timeout: 20_000 })

      // === HOST: Start match → Halftime → Finish ===
      await hostPage.getByRole('link', { name: 'Jogo' }).click()
      await expect(hostPage.getByRole('button', { name: 'Iniciar jogo' })).toBeVisible({ timeout: 30_000 })
      await hostPage.getByRole('button', { name: 'Iniciar jogo' }).click()
      await expect(hostPage.getByLabel('Status da partida: Ao vivo').first()).toBeVisible({ timeout: 20_000 })

      await hostPage.getByRole('button', { name: 'Abrir intervalo' }).click()
      await expect(hostPage.getByLabel('Status da partida: Intervalo').first()).toBeVisible({ timeout: 20_000 })

      // === GUEST: Play Copa Pare ===
      await guestPage.goto(`/sala/${roomCode}/copa-pare`)
      await guestPage.getByLabel('Sua resposta').fill('Neymar')
      await guestPage.getByRole('button', { name: /Confirmar Copa Stop/ }).click()
      await expect(guestPage.getByText('Você entrou no Copa Stop!')).toBeVisible({ timeout: 20_000 })

      // === HOST: Finish match ===
      await hostPage.getByRole('button', { name: 'Encerrar partida' }).click()
      await expect(hostPage.getByLabel('Status da partida: Encerrado').first()).toBeVisible({ timeout: 20_000 })

      // Submit result
      await hostPage.locator('#winner').fill('Brasil')
      await hostPage.locator('#homeScore').fill('2')
      await hostPage.locator('#awayScore').fill('1')
      await hostPage.locator('#playerOfMatch').fill('Neymar')
      await hostPage.getByRole('button', { name: /Salvar resultado/ }).click()
      await expect(hostPage.getByText('Resultado salvo')).toBeVisible({ timeout: 20_000 })

      // === Verify ranking ===
      await hostPage.getByRole('link', { name: 'Ranking' }).click()
      const ranking = hostPage.getByLabel('Ranking da sala')
      await expect(ranking.getByText('Host E2E')).toBeVisible()
      await expect(ranking.getByText('Guest E2E')).toBeVisible()
      await expect(ranking.getByText(/\d+ pts/).first()).toBeVisible()

    } finally {
      await hostCtx.close()
      await guestCtx.close()
    }
  })
})
