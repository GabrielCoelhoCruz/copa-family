import Image from 'next/image'

import { flagCdnUrl } from '@/features/fixtures/team-country-flags'
import { cn } from '@/lib/utils'

type LandingPitchPreviewProps = {
  className?: string
}

function LandingPitchPreview({ className }: LandingPitchPreviewProps) {
  return (
    <div
      className={cn(
        'relative h-[150px] overflow-hidden rounded-[18px] border border-[var(--home-gold)]/28',
        'bg-[repeating-linear-gradient(90deg,#355030_0_34px,#2f4a2b_34px_68px)]',
        className
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 340 188"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 size-full"
      >
        <g fill="none" stroke="rgba(231,211,160,0.55)" strokeWidth="1.4">
          <rect x="6" y="6" width="328" height="176" rx="4" />
          <line x1="170" y1="6" x2="170" y2="182" />
          <circle cx="170" cy="94" r="34" />
          <rect x="6" y="49" width="44" height="90" />
          <rect x="290" y="49" width="44" height="90" />
          <rect x="6" y="70" width="16" height="48" />
          <rect x="318" y="70" width="16" height="48" />
        </g>
      </svg>

      <div className="absolute inset-0 flex items-center justify-between px-[26px]">
        <div className="text-center">
          <Image
            src={flagCdnUrl('br', 80)}
            alt=""
            width={42}
            height={42}
            className="mx-auto size-[42px] rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
            unoptimized
          />
          <p className="mt-1.5 text-[13px] font-bold text-white">Brasil</p>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex size-[52px] items-center justify-center rounded-full border border-[var(--home-gold-soft)]/70 bg-[radial-gradient(circle,rgba(217,189,128,0.32),rgba(217,189,128,0.06))] font-black text-[var(--home-gold-soft)] shadow-[0_0_22px_rgba(217,189,128,0.35)]">
            VS
          </div>
          <p className="text-[10.5px] font-bold tracking-wide text-white/80">
            Hoje · 16:00
          </p>
        </div>

        <div className="text-center">
          <Image
            src={flagCdnUrl('ar', 80)}
            alt=""
            width={42}
            height={42}
            className="mx-auto size-[42px] rounded-full object-cover shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]"
            unoptimized
          />
          <p className="mt-1.5 text-[13px] font-bold text-white">Argentina</p>
        </div>
      </div>
    </div>
  )
}

export { LandingPitchPreview }
