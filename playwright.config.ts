import { config as loadEnv } from 'dotenv'
import { resolve } from 'node:path'
import { defineConfig, devices } from '@playwright/test'

/**
 * E2E env (loaded from .env.local / .env):
 * - NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY (required)
 * - PLAYWRIGHT_PORT (default 3000), PLAYWRIGHT_BASE_URL (overrides host)
 * - PLAYWRIGHT_SKIP_WEBSERVER=1 — app already running
 * - CI=true — build + next start, 2 retries, 120s test timeout
 */
loadEnv({ path: resolve(__dirname, '.env.local') })
loadEnv({ path: resolve(__dirname, '.env') })

const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3000)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/global-setup.ts',
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: 1,
  reporter: isCI ? 'github' : 'list',
  timeout: isCI ? 120_000 : 90_000,
  expect: {
    timeout: 15_000,
  },
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
        command: isCI
          ? `npm run build && npx next start -p ${PORT}`
          : `npm run dev -- -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !isCI,
        timeout: 120_000,
      },
})
