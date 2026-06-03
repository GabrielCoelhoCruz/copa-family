import { cache } from 'react'

import {
  countDistinctGroups,
  countRealTeams,
  countTeamsWithBadge,
} from '@/features/fixtures/catalog-view'
import { DEFAULT_SYNC_PROVIDER, WORLD_CUP_SEASON } from '@/features/fixtures/constants'
import { getWorldCupVenueCount } from '@/features/fixtures/queries'
import { createAdminClient } from '@/lib/supabase/admin'
import type { DbFootballTeam } from '@/lib/types'

export type EnvCheckStatus = {
  key: string
  label: string
  configured: boolean
}

export type CatalogAdminSnapshot = {
  fixtureCount: number
  teamCount: number
  realTeamCount: number
  venueCount: number
  groupCount: number
  teamsWithBadge: number
  provider: string
  lastSync: {
    status: string
    provider: string
    mode: string
    rowsUpserted: number
    warnings: unknown
    startedAt: string
    completedAt: string | null
    errorMessage: string | null
  } | null
  envChecks: EnvCheckStatus[]
}

function getEnvChecks(): EnvCheckStatus[] {
  return [
    {
      key: 'NEXT_PUBLIC_SUPABASE_URL',
      label: 'Supabase URL',
      configured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    },
    {
      key: 'SUPABASE_SERVICE_ROLE_KEY',
      label: 'Service role',
      configured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    },
    {
      key: 'RAPIDAPI_WC26_KEY',
      label: 'RapidAPI WC26',
      configured: Boolean(process.env.RAPIDAPI_WC26_KEY?.trim()),
    },
    {
      key: 'FIXTURE_SYNC_TOKEN',
      label: 'Token de sync',
      configured: Boolean(process.env.FIXTURE_SYNC_TOKEN?.trim()),
    },
  ]
}

export const getCatalogAdminSnapshot = cache(
  async (): Promise<CatalogAdminSnapshot> => {
    const admin = createAdminClient()
    const season = WORLD_CUP_SEASON

    const [fixturesRes, teamsRes, venueCount, syncRes] = await Promise.all([
      admin
        .from('football_fixtures')
        .select('id', { count: 'exact', head: true })
        .eq('season', season),
      admin
        .from('football_teams')
        .select(
          'id, season, name, short_name, slug, country_code, flag_url, badge_url, group_name, is_qualified'
        )
        .eq('season', season),
      getWorldCupVenueCount(),
      admin
        .from('football_data_sync_runs')
        .select(
          'status, provider, mode, rows_upserted, warnings, started_at, completed_at, error_message'
        )
        .order('started_at', { ascending: false })
        .limit(1),
    ])

    if (fixturesRes.error) throw fixturesRes.error
    if (teamsRes.error) throw teamsRes.error
    if (syncRes.error) throw syncRes.error

    const teams = (teamsRes.data ?? []) as DbFootballTeam[]

    const lastRow = syncRes.data?.[0]
    const lastSync = lastRow
      ? {
          status: lastRow.status,
          provider: lastRow.provider,
          mode: lastRow.mode,
          rowsUpserted: lastRow.rows_upserted,
          warnings: lastRow.warnings,
          startedAt: lastRow.started_at,
          completedAt: lastRow.completed_at,
          errorMessage: lastRow.error_message,
        }
      : null

    return {
      fixtureCount: fixturesRes.count ?? 0,
      teamCount: teams.length,
      realTeamCount: countRealTeams(teams),
      venueCount,
      groupCount: countDistinctGroups(teams),
      teamsWithBadge: countTeamsWithBadge(teams),
      provider: process.env.FIXTURE_SYNC_PROVIDER ?? DEFAULT_SYNC_PROVIDER,
      lastSync,
      envChecks: getEnvChecks(),
    }
  }
)
