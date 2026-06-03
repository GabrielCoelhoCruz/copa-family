'use client'

import { AlertTriangle } from 'lucide-react'

import { Button } from '@/components/ui/button'

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertTriangle className="size-6" aria-hidden />
      </div>
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-black">Algo saiu do roteiro</h1>
        <p className="text-sm text-muted-foreground">
          Recarregue a jogada. Se continuar, mande o código da sala para quem está testando.
        </p>
        {error.digest ? (
          <p className="font-mono text-xs text-muted-foreground">Erro {error.digest}</p>
        ) : null}
      </div>
      <Button type="button" variant="party" className="min-h-11" onClick={reset}>
        Tentar de novo
      </Button>
    </main>
  )
}
