import { expect, test } from '@playwright/test'

const hasSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

test.describe('multiusuário', () => {
  test.skip(!hasSupabase, 'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  test('segundo participante entra e aparece no ranking', async ({
    browser,
  }) => {
    const stamp = Date.now()
    const hostName = `Host ${stamp}`
    const guestName = `Convidado ${stamp}`
    const roomName = `Família ${stamp}`

    const hostContext = await browser.newContext()
    const guestContext = await browser.newContext()
    const hostPage = await hostContext.newPage()
    const guestPage = await guestContext.newPage()

    try {
      await hostPage.goto('/criar-sala')
      await hostPage.getByLabel('Seu nome').fill(hostName)
      await hostPage.getByLabel('Nome da sala').fill(roomName)
      await hostPage.getByRole('button', { name: 'Criar sala' }).click()
      await expect(hostPage).toHaveURL(/\/sala\/([A-Z0-9]{6})/i, {
        timeout: 30_000,
      })

      const roomUrl = hostPage.url()
      const roomCodeMatch = roomUrl.match(/\/sala\/([A-Z0-9]{6})/i)
      const roomCode = roomCodeMatch?.[1]
      expect(roomCode).toBeTruthy()

      await hostPage.getByRole('button', { name: 'Abrir palpites' }).click()
      await expect(
        hostPage.getByLabel('Status da partida: Palpites abertos').first()
      ).toBeVisible({ timeout: 20_000 })

      await guestPage.goto(`/entrar?code=${roomCode}`)
      await guestPage.getByLabel('Seu nome').fill(guestName)
      await guestPage.getByRole('button', { name: 'Entrar na sala' }).click()
      await expect(guestPage).toHaveURL(
        new RegExp(`/sala/${roomCode}`, 'i'),
        { timeout: 30_000 }
      )

      await guestPage.getByRole('link', { name: 'Palpite', exact: true }).click()
      await guestPage.getByLabel('Vencedor').fill('Argentina')
      await guestPage.getByLabel('Gols do mandante').fill('0')
      await guestPage.getByLabel('Gols do visitante').fill('1')
      await guestPage.getByLabel('Craque da partida').fill('Messi')
      await guestPage.getByRole('button', { name: /Salvar palpite/ }).click()
      await expect(
        guestPage.getByRole('status').filter({ hasText: 'Palpite salvo' })
      ).toBeVisible({ timeout: 20_000 })

      await hostPage.getByRole('link', { name: 'Palpite', exact: true }).click()
      await hostPage.getByLabel('Vencedor').fill('Brasil')
      await hostPage.getByLabel('Gols do mandante').fill('2')
      await hostPage.getByLabel('Gols do visitante').fill('1')
      await hostPage.getByLabel('Craque da partida').fill('Neymar')
      await hostPage.getByRole('button', { name: /Salvar palpite/ }).click()
      await expect(
        hostPage.getByRole('status').filter({ hasText: 'Palpite salvo' })
      ).toBeVisible({ timeout: 20_000 })

      await hostPage.getByRole('link', { name: 'Ranking' }).click()
      await expect(hostPage.getByText(hostName)).toBeVisible()
      await expect(hostPage.getByText(guestName)).toBeVisible()
      await expect(hostPage.getByText('10 pts', { exact: true }).first()).toBeVisible()
    } finally {
      await hostContext.close()
      await guestContext.close()
    }
  })
})
