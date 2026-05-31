import { expect, test } from '@playwright/test'

const hasSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

test.describe('ranking', () => {
  test.skip(!hasSupabase, 'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  test('empate e nome longo no ranking', async ({ browser }) => {
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
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, {
        timeout: 30_000,
      })

      const roomCode = hostPage.url().match(/\/sala\/([A-Z0-9]{6})/i)?.[1]
      expect(roomCode).toBeTruthy()

      await hostPage.getByRole('button', { name: 'Abrir palpites' }).click()

      await guestPage.goto(`/entrar?code=${roomCode}`)
      await guestPage.getByLabel('Seu nome').fill(guestName)
      await guestPage.getByRole('button', { name: 'Entrar na sala' }).click()

      for (const page of [hostPage, guestPage]) {
        await page.getByRole('link', { name: 'Palpite', exact: true }).click()
        await page.getByLabel('Vencedor').fill('Brasil')
        await page.getByLabel('Gols do mandante').fill('1')
        await page.getByLabel('Gols do visitante').fill('0')
        await page.getByLabel('Craque da partida').fill('Neymar')
        await page.getByRole('button', { name: /Salvar palpite/ }).click()
        await expect(
          page.getByRole('status').filter({ hasText: 'Palpite salvo' })
        ).toBeVisible({ timeout: 20_000 })
      }

      await hostPage.getByRole('link', { name: 'Ranking', exact: true }).click()
      await expect(hostPage.locator(`[title="${longName}"]`)).toBeVisible()
      await expect(hostPage.getByText(guestName)).toBeVisible()
      const tenPts = hostPage.getByText('10 pts', { exact: true })
      await expect(tenPts).toHaveCount(2)
    } finally {
      await hostContext.close()
      await guestContext.close()
    }
  })
})
