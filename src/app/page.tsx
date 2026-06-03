import Link from 'next/link'
import { Trophy } from 'lucide-react'

import { OnboardingSteps } from '@/components/onboarding-steps'
import { SiteShell } from '@/components/layouts/site-shell'
import { SiteStickyFooter } from '@/components/layouts/site-sticky-footer'
import { HomeFeatureBento } from '@/components/patterns/home-feature-bento'
import { HomeHeroVisual } from '@/components/patterns/home-hero-visual'
import { PwaInstallBanner } from '@/components/pwa-install-banner'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <SiteShell
      ambient="home"
      mainClassName="cf-scrollbar-hidden flex-1 gap-[var(--site-section-gap)] overflow-x-hidden px-[var(--site-page-px)] pb-36 pt-6"
      footer={
        <SiteStickyFooter>
          <div className="space-y-3">
            <Link
              href={routes.criarSala}
              className={cn(
                buttonVariants({ variant: 'party', size: 'lg' }),
                'cf-pressable flex min-h-12 w-full items-center justify-center'
              )}
            >
              Criar sala
            </Link>
            <Link
              href={routes.entrar}
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'cf-pressable flex min-h-12 w-full items-center justify-center bg-card/80'
              )}
            >
              Entrar com código
            </Link>
            <p className="text-center text-xs text-muted-foreground">
              Sem cadastro. Comece em menos de 1 minuto.
            </p>
          </div>
        </SiteStickyFooter>
      }
    >
      <section className="cf-animate-in relative flex flex-col items-center gap-5 rounded-[2rem] border border-border bg-card/90 p-5 text-center shadow-lg shadow-brand-field/10">
        <Badge variant="match-halftime" className="relative h-7 px-3">
          <Trophy />
          Jogo social da Copa
        </Badge>

        <div className="relative space-y-2">
          <h1 className="font-heading text-4xl font-black tracking-tight text-foreground">
            Copa Family
          </h1>
          <p className="text-pretty text-base leading-relaxed text-muted-foreground">
            Transforme cada jogo em competição em família. Crie a sala, convide e jogue.
          </p>
        </div>

        <HomeHeroVisual />
      </section>

      <PwaInstallBanner />

      <section
        aria-labelledby="como-funciona-heading"
        className="cf-animate-in space-y-3"
        style={{ animationDelay: '80ms' }}
      >
        <h2
          id="como-funciona-heading"
          className="font-heading text-lg font-bold tracking-tight"
        >
          Como funciona
        </h2>
        <OnboardingSteps />
      </section>

      <section
        aria-labelledby="recursos-heading"
        className="cf-animate-in space-y-3 pb-4"
        style={{ animationDelay: '120ms' }}
      >
        <h2
          id="recursos-heading"
          className="font-heading text-lg font-bold tracking-tight"
        >
          O que você faz na sala
        </h2>
        <p className="text-sm text-muted-foreground">
          Palpite, ranking e perfil nas abas da sala. Copa Pare aparece no intervalo.{' '}
          <Link
            href={routes.calendario}
            className="font-semibold text-brand-field underline-offset-2 hover:underline"
          >
            Ver calendário da Copa
          </Link>
          .
        </p>
        <HomeFeatureBento />
      </section>
    </SiteShell>
  )
}
