import { notFound } from 'next/navigation'

import { getFixtureSyncToken } from '@/lib/env'

/** Gate for `/admin/*` pages (returns 404 when disabled). */
export function assertAdminMetricsPageEnabled(): void {
  if (process.env.ENABLE_ADMIN_METRICS !== 'true') {
    notFound()
  }
}

/** Gate for catalog server actions (metrics flag + sync token from form). */
export function assertCatalogAdminAction(formData: FormData): void {
  if (process.env.ENABLE_ADMIN_METRICS !== 'true') {
    throw new Error('Admin desabilitado.')
  }

  const expected = process.env.FIXTURE_SYNC_TOKEN?.trim()
  if (!expected) {
    throw new Error('FIXTURE_SYNC_TOKEN não configurado.')
  }

  const token = formData.get('syncToken')?.toString().trim()
  if (!token || token !== expected) {
    throw new Error('Token de sincronização inválido.')
  }
}

/** Server-only token for hidden admin forms (never log or display). */
export function getCatalogAdminSyncToken(): string {
  return getFixtureSyncToken()
}
