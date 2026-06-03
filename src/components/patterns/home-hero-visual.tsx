import { CircleDot, Trophy, Users } from 'lucide-react'

function HomeHeroVisual() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-[1.75rem] border border-brand-field/25 bg-gradient-to-br from-brand-field/20 via-brand-cream to-brand-trophy/18 p-4 shadow-md shadow-brand-field/10"
      aria-label="Prévia visual de uma sala de palpites da Copa"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            color-mix(in oklch, var(--brand-field), transparent 72%) 0,
            color-mix(in oklch, var(--brand-field), transparent 72%) 2px,
            transparent 2px,
            transparent 30px
          )`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-brand-sky/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 size-28 rounded-full bg-brand-trophy/25 blur-2xl" />

      <div className="relative grid min-h-44 grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-field/25 bg-card/75 px-2.5 py-1 text-[11px] font-bold text-brand-field shadow-sm">
            <CircleDot className="size-3.5" aria-hidden />
            Palpites abertos
          </div>
          <div>
            <p className="font-heading text-2xl font-black leading-none text-foreground">
              2
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Casa
            </p>
          </div>
        </div>

        <div className="relative flex size-24 items-center justify-center rounded-full border border-brand-field/25 bg-card/75 shadow-sm">
          <div className="absolute inset-3 rounded-full border border-brand-field/20" />
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-brand-field/15" />
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-brand-field/15" />
          <div className="relative flex size-12 items-center justify-center rounded-full bg-foreground text-background shadow-sm">
            <Trophy className="size-5 text-brand-trophy" aria-hidden />
          </div>
        </div>

        <div className="space-y-3 text-right">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-party/25 bg-card/75 px-2.5 py-1 text-[11px] font-bold text-brand-party shadow-sm">
            <Users className="size-3.5" aria-hidden />
            Família
          </div>
          <div>
            <p className="font-heading text-2xl font-black leading-none text-foreground">
              1
            </p>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Visita
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-3 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 text-left shadow-sm">
        <div className="min-w-0">
          <p className="font-heading text-sm font-bold leading-tight">
            Quem acerta sobe no ranking
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            Palpite, craque, placar e brincadeira no intervalo.
          </p>
        </div>
        <div className="flex -space-x-2" aria-hidden>
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-brand-field text-xs font-bold text-primary-foreground">
            L
          </span>
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-brand-party text-xs font-bold text-primary-foreground">
            M
          </span>
          <span className="flex size-8 items-center justify-center rounded-full border-2 border-card bg-brand-trophy text-xs font-bold text-secondary-foreground">
            V
          </span>
        </div>
      </div>
    </div>
  )
}

export { HomeHeroVisual }
