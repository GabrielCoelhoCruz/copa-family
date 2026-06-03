import { Medal, PartyPopper, Timer, Users } from 'lucide-react'

const fieldStripeStyle = {
  backgroundImage: `repeating-linear-gradient(
    90deg,
    color-mix(in oklch, var(--brand-field), transparent 70%) 0,
    color-mix(in oklch, var(--brand-field), transparent 70%) 2px,
    transparent 2px,
    transparent 22px
  )`,
} as const

function MiniPitch() {
  return (
    <div
      className="relative h-20 overflow-hidden rounded-2xl border border-brand-field/20 bg-brand-field/10"
      aria-hidden
    >
      <div className="absolute inset-0 opacity-70" style={fieldStripeStyle} />
      <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-brand-field/20" />
      <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-field/25" />
      <div className="absolute left-3 top-1/2 h-9 w-5 -translate-y-1/2 rounded-r-full border border-l-0 border-brand-field/25" />
      <div className="absolute right-3 top-1/2 h-9 w-5 -translate-y-1/2 rounded-l-full border border-r-0 border-brand-field/25" />
      <div className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-2xl bg-brand-trophy text-foreground shadow-sm">
        <Users className="size-5 text-primary-foreground" aria-hidden />
      </div>
    </div>
  )
}

function TimerMark() {
  return (
    <div
      className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-brand-party/25 bg-brand-party/15"
      aria-hidden
    >
      <div className="absolute inset-1 rounded-xl border border-dashed border-brand-party/35" />
      <Timer className="size-5 text-brand-party" />
    </div>
  )
}

function MedalStack() {
  return (
    <div
      className="flex size-12 shrink-0 items-end justify-center gap-1 rounded-2xl border border-rank-gold/30 bg-rank-gold/15 px-2 pb-2"
      aria-hidden
    >
      <span className="h-5 w-2 rounded-full bg-rank-silver/70" />
      <span className="h-8 w-2 rounded-full bg-rank-gold" />
      <span className="h-4 w-2 rounded-full bg-rank-bronze/80" />
    </div>
  )
}

function HomeFeatureBento() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-2 auto-rows-auto min-[380px]:grid-cols-[1.12fr_0.88fr] min-[380px]:auto-rows-[minmax(4.25rem,auto)]"
      aria-label="Recursos do app"
    >
      <div className="relative min-[380px]:row-span-2 overflow-hidden rounded-2xl border border-brand-field/20 bg-gradient-to-br from-brand-field/15 via-brand-cream/80 to-brand-field/5 p-3 text-left">
        <div
          className="pointer-events-none absolute -left-8 -top-8 size-24 rounded-full bg-brand-field/15 blur-2xl"
          aria-hidden
        />
        <div className="relative flex h-full flex-col justify-between gap-3">
          <MiniPitch />
          <div className="space-y-0.5">
            <p className="font-heading text-base font-bold leading-tight">Salas</p>
            <p className="text-xs leading-snug text-muted-foreground">
              Convide a família em segundos
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-brand-party/25 bg-gradient-to-tr from-brand-party/20 via-card/90 to-brand-party/5 p-3 text-left">
        <div
          className="pointer-events-none absolute -right-6 -top-6 size-16 rounded-full bg-brand-party/25 blur-xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <TimerMark />
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-1">
              <PartyPopper className="size-4 text-brand-party" aria-hidden />
              <span className="font-mono text-[10px] font-bold text-brand-party">
                30s
              </span>
            </div>
            <p className="text-xs font-bold leading-tight">Copa Pare</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-rank-gold/35 bg-gradient-to-bl from-rank-gold/25 via-card/90 to-rank-gold/10 p-3 text-left">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklch,var(--rank-gold),transparent_55%),transparent_55%)]"
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <MedalStack />
          <div className="min-w-0 flex-1">
            <Medal className="mb-1 size-5 text-rank-gold" aria-hidden />
            <p className="text-xs font-bold leading-tight">Medalhas</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export { HomeFeatureBento }
