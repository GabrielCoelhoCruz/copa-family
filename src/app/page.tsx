import Link from 'next/link'
import { Camera, Crown, Trophy, Users } from 'lucide-react'

import { OnboardingSteps } from '@/components/onboarding-steps'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-6">
      <div className="flex flex-1 flex-col gap-6">
        <section className="relative flex flex-col items-center gap-5 rounded-[2rem] border border-border bg-card/90 p-5 text-center shadow-lg shadow-brand-field/10">
          <div
            className="pointer-events-none absolute -top-12 right-2 size-28 rounded-full bg-brand-trophy/25 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-2 size-24 rounded-full bg-brand-sky/20 blur-3xl"
            aria-hidden
          />

          <Badge variant="match-halftime" className="relative h-7 px-3">
            <Trophy />
            Jogo social da Copa
          </Badge>

          <div className="relative space-y-2">
            <h1 className="font-heading text-4xl font-black tracking-tight text-foreground">
              Copa Family
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Sala rápida, palpite antes do jogo e ranking com a família — tudo no celular.
            </p>
          </div>

          <div className="relative grid w-full grid-cols-3 gap-2">
            <div className="rounded-2xl border border-brand-field/20 bg-brand-field/10 p-2.5">
              <Users className="mx-auto mb-1.5 size-5 text-brand-field" />
              <p className="text-[11px] font-bold leading-tight">Salas</p>
            </div>
            <div className="rounded-2xl border border-brand-party/20 bg-brand-party/10 p-2.5">
              <Camera className="mx-auto mb-1.5 size-5 text-brand-party" />
              <p className="text-[11px] font-bold leading-tight">Fotos</p>
            </div>
            <div className="rounded-2xl border border-rank-gold/30 bg-rank-gold/15 p-2.5">
              <Crown className="mx-auto mb-1.5 size-5 text-rank-gold" />
              <p className="text-[11px] font-bold leading-tight">Ranking</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="como-funciona-heading" className="space-y-3">
          <h2
            id="como-funciona-heading"
            className="font-heading text-lg font-bold tracking-tight"
          >
            Como funciona
          </h2>
          <OnboardingSteps />
        </section>
      </div>

      <div className="sticky bottom-[env(safe-area-inset-bottom)] z-20 -mx-1 space-y-3 border-t border-border/80 bg-background/95 px-1 pt-3 backdrop-blur-md">
        <Link
          href={routes.criarSala}
          className={cn(
            buttonVariants({ variant: 'party', size: 'lg' }),
            'flex min-h-12 w-full items-center justify-center'
          )}
        >
          Criar sala
        </Link>
        <Link
          href={routes.entrar}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'lg' }),
            'flex min-h-12 w-full items-center justify-center bg-card/80'
          )}
        >
          Entrar com código
        </Link>
        <p className="text-center text-xs text-muted-foreground">
          Sem cadastro. Comece em menos de 1 minuto.
        </p>
      </div>
    </main>
  )
}
