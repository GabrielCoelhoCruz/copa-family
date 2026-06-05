import Image from 'next/image'

import {
  flagCdnUrl,
  nationalTeamFlagUrl,
} from '@/features/fixtures/team-country-flags'
import { FIFA_FLAG_ISO } from '@/lib/copa-theme'
import { cn } from '@/lib/utils'

type StadiumFlagProps = {
  /** FIFA 3-letter code (BRA, ARG, …) */
  code?: string
  /** National team display name (Brasil, Argentina, …) */
  teamName?: string
  size?: number
  round?: boolean
  ring?: string
  className?: string
}

function resolveFlagSrc(code?: string, teamName?: string): string | null {
  if (teamName) {
    const fromName = nationalTeamFlagUrl(teamName)
    if (fromName) return fromName
  }
  if (code) {
    const iso = FIFA_FLAG_ISO[code]
    if (iso) return flagCdnUrl(iso, 80)
  }
  return null
}

function StadiumFlag({
  code,
  teamName,
  size = 36,
  round = false,
  ring,
  className,
}: StadiumFlagProps) {
  const src = resolveFlagSrc(code, teamName)
  const height = round ? size : Math.round(size * 0.72)

  if (!src) {
    return (
      <div
        className={cn('shrink-0 bg-slate-500/60', round ? 'rounded-full' : 'rounded-[22%]', className)}
        style={{ width: size, height }}
        aria-hidden
      />
    )
  }

  return (
    <Image
      src={src}
      alt=""
      width={size}
      height={height}
      unoptimized
      className={cn(
        'shrink-0 object-cover shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]',
        round ? 'rounded-full' : 'rounded-[22%]',
        className
      )}
      style={ring ? { boxShadow: `0 0 0 2px ${ring}` } : undefined}
    />
  )
}

export { StadiumFlag }
