import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { FlowLayout } from '@/components/flow-layout'
import { JoinRoomForm } from '@/components/join-room-form'
import { buttonVariants } from '@/components/ui/button'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

type EntrarPageProps = {
  searchParams: Promise<{ code?: string }>
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const { code } = await searchParams
  const defaultRoomCode = code?.trim().toUpperCase() ?? ''

  return (
    <FlowLayout>
      <Link
        href={routes.home}
        className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit -ml-1')}
      >
        <ArrowLeft />
        Voltar
      </Link>

      <JoinRoomForm defaultRoomCode={defaultRoomCode} />
    </FlowLayout>
  )
}
