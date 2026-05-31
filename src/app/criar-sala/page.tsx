import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { CreateRoomForm } from '@/components/create-room-form'
import { FlowLayout } from '@/components/flow-layout'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

export default function CriarSalaPage() {
  return (
    <FlowLayout>
      <Link
        href={routes.home}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit -ml-1')}
      >
        <ArrowLeft />
        Voltar
      </Link>

      <CreateRoomForm />
    </FlowLayout>
  )
}
