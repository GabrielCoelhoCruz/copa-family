'use client'

import { Download, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  clearPwaDeferredPrompt,
  dismissPwaInstall,
  isPwaBannerVisible,
  usePwaInstallStore,
} from '@/lib/pwa-install-store'
import { cn } from '@/lib/utils'

type PwaInstallBannerProps = {
  className?: string
  variant?: 'default' | 'on-pitch'
}

function PwaInstallBanner({
  className,
  variant = 'default',
}: PwaInstallBannerProps) {
  const snapshot = usePwaInstallStore()
  const visible = isPwaBannerVisible(snapshot)

  const handleDismiss = () => {
    dismissPwaInstall()
  }

  const handleInstall = async () => {
    const prompt = snapshot.deferredPrompt
    if (!prompt) return
    await prompt.prompt()
    await prompt.userChoice
    clearPwaDeferredPrompt()
  }

  if (!visible) return null

  return (
    <aside
      className={cn(
        'rounded-2xl border p-4 shadow-sm',
        variant === 'on-pitch'
          ? 'border-white/15 bg-white/10 text-white backdrop-blur-md'
          : 'border-brand-sky/30 bg-gradient-to-br from-brand-sky/15 to-card',
        className
      )}
      aria-label="Instalar aplicativo"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p
            className={cn(
              'text-base font-bold',
              variant === 'on-pitch' ? 'text-white' : 'font-heading'
            )}
          >
            Instale no celular
          </p>
          <p
            className={cn(
              'text-sm',
              variant === 'on-pitch' ? 'text-white/72' : 'text-muted-foreground'
            )}
          >
            {snapshot.isIosHint
              ? 'No Safari: Compartilhar → Adicionar à Tela de Início. Ideal para teste com a família.'
              : 'Abra mais rápido na Copa, como um app. Ótimo para o sofá e o intervalo.'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            'rounded-lg p-1',
            variant === 'on-pitch'
              ? 'text-white/70 hover:bg-white/10'
              : 'text-muted-foreground hover:bg-muted/80'
          )}
          aria-label="Fechar dica de instalação"
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
      {!snapshot.isIosHint && snapshot.deferredPrompt ? (
        <Button
          type="button"
          variant="party"
          className="mt-3 min-h-11 w-full"
          onClick={handleInstall}
        >
          <Download />
          Adicionar à tela inicial
        </Button>
      ) : null}
    </aside>
  )
}

export { PwaInstallBanner }
