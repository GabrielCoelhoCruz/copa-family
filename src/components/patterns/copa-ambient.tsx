import { cn } from '@/lib/utils'

type CopaAmbientProps = {
  variant?: 'home' | 'sala' | 'celebrate'
  className?: string
}

/**
 * Decorativo Copa/futebol sem bandeira literal (ver PRODUCT.md anti-references).
 * Gramado, arco de gol e brilho de troféu — só atmosphere, não compete com conteúdo.
 */
function CopaAmbient({ variant = 'home', className }: CopaAmbientProps) {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden="true"
    >
      {/* Gramado sutil */}
      <div
        className="absolute inset-x-0 bottom-0 h-40 opacity-[0.14]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            color-mix(in oklch, var(--brand-field), transparent 55%) 0,
            color-mix(in oklch, var(--brand-field), transparent 55%) 2px,
            transparent 2px,
            transparent 28px
          )`,
        }}
      />

      {/* Arco de gol — canto inferior */}
      {(variant === 'home' || variant === 'sala') && (
        <svg
          className="absolute -bottom-6 -right-8 size-44 text-brand-field/25"
          viewBox="0 0 120 80"
          fill="none"
        >
          <path
            d="M8 72V28C8 14 22 8 60 8s52 6 52 20v44"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M8 72H112"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Bola decorativa */}
      <div
        className={cn(
          'absolute rounded-full border-2 border-brand-cream/40 bg-gradient-to-br from-brand-field/30 to-brand-field/10 shadow-inner',
          variant === 'celebrate'
            ? 'right-6 top-8 size-14 cf-ball-float'
            : 'right-4 top-16 size-10 cf-ball-float opacity-80'
        )}
      >
        <div className="absolute inset-[18%] rounded-full border border-brand-cream/30" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-cream/20" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-brand-cream/20" />
      </div>

      {/* Brilho troféu */}
      <div
        className={cn(
          'cf-trophy-glow absolute -left-16 top-0 size-56 rounded-full blur-3xl',
          variant === 'celebrate' ? 'bg-brand-trophy/35' : 'bg-brand-trophy/20'
        )}
      />

      {variant === 'celebrate' && (
        <div className="absolute inset-x-8 top-12 flex justify-between opacity-50">
          <span className="size-2 rounded-full bg-brand-party cf-trophy-glow" />
          <span className="size-2 rounded-full bg-brand-trophy cf-trophy-glow" />
          <span className="size-2 rounded-full bg-brand-sky cf-trophy-glow" />
        </div>
      )}
    </div>
  )
}

export { CopaAmbient }
