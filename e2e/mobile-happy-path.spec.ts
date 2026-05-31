import { expect, test } from '@playwright/test'

const hasSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

test.describe('fluxo mobile 390px', () => {
  test.skip(!hasSupabase, 'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

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
    await page.getByRole('button', { name: 'Criar sala' }).click()

    await expect(page).toHaveURL(/\/sala\/[A-Z0-9]{6}/i, { timeout: 30_000 })
    await expect(page.getByText('Código da sala')).toBeVisible()

    await page.getByTestId('toggle-room-qr').click()
    await expect(page).toHaveURL(/\?qr=1/)
    await expect(page.getByTestId('room-qr-dialog')).toBeVisible({ timeout: 15_000 })
    await expect(
      page.getByRole('img', { name: /QR Code do link de convite/i })
    ).toBeVisible({ timeout: 15_000 })

    await page.getByRole('button', { name: 'Abrir palpites' }).click()
    await expect(
      page.getByLabel('Status da partida: Palpites abertos').first()
    ).toBeVisible({ timeout: 20_000 })

    await page.getByRole('link', { name: 'Palpite' }).click()
    await expect(page).toHaveURL(/\/palpites/)

    await page.getByLabel('Vencedor').fill('Brasil')
    await page.getByLabel('Gols do mandante').fill('2')
    await page.getByLabel('Gols do visitante').fill('1')
    await page.getByLabel('Craque da partida').fill('Neymar')
    await page.getByRole('button', { name: /Salvar palpite/ }).click()

    await expect(
      page.getByRole('status').filter({ hasText: 'Palpite salvo' })
    ).toBeVisible({ timeout: 20_000 })

    await page.getByRole('link', { name: 'Ranking' }).click()
    await expect(page).toHaveURL(/\/ranking/)
    await expect(page.getByText('10 pts', { exact: true })).toBeVisible()
    await expect(page.getByText(displayName)).toBeVisible()
  })
})
