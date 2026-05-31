import Link from 'next/link'

import { EmptyState } from '@/components/patterns/empty-state'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default function SalaNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center p-4">
      <EmptyState
        title="Sala não encontrada"
        description="Confira o código com quem criou a sala ou crie uma nova."
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href={routes.entrar}
              className={cn(buttonVariants({ variant: 'party' }))}
            >
              Entrar com código
            </Link>
            <Link
              href={routes.criarSala}
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Criar sala
            </Link>
          </div>
        }
      />
    </main>
  )
}
