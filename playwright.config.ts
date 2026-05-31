import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'
import { defineConfig, devices } from '@playwright/test'

loadEnv({ path: resolve(__dirname, '.env.local') })
loadEnv({ path: resolve(__dirname, '.env') })

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 60_000,
  use: {
    baseURL,
    ...devices['iPhone 14'],
    viewport: { width: 390, height: 844 },
    locale: 'pt-BR',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: {
        ...devices['iPhone 14'],
        browserName: 'chromium',
      },
    },
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: process.env.CI
          ? `npm run build && npx next start -p ${PORT}`
          : `npm run dev -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
})
