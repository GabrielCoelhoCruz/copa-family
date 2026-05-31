import { expect, test } from '@playwright/test'

const hasSupabase =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)

test.describe('erros de fluxo', () => {
  test.skip(!hasSupabase, 'Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')

  test('código inválido ao entrar', async ({ page }) => {
    await page.goto('/entrar')
    await page.getByLabel('Seu nome').fill('Visitante Erro')
    await page.getByLabel('Código da sala').fill('ZZZZZZ')
    await page.getByRole('button', { name: 'Entrar na sala' }).click()

    await expect(
      page.getByText(/Código não encontrado/i)
    ).toBeVisible({ timeout: 15_000 })
  })

  test('palpite fechado antes de abrir', async ({ page }) => {
    const stamp = Date.now()
    const displayName = `Host ${stamp}`

    await page.goto('/criar-sala')
    await page.getByLabel('Seu nome').fill(displayName)
    await page.getByLabel('Nome da sala').fill(`Sala erro ${stamp}`)
    await page.getByRole('button', { name: 'Criar sala' }).click()
    await expect(page).toHaveURL(/\/sala\/[A-Z0-9]{6}/i, { timeout: 30_000 })

    await page.getByRole('link', { name: 'Palpite', exact: true }).click()
    await expect(page.getByText(/Palpites fechados/i)).toBeVisible({
      timeout: 15_000,
    })
  })
})
