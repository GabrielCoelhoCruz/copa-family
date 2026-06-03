import { JoinRoomForm } from '@/components/join-room-form'
import { FlowPage } from '@/components/layouts/flow-page'
import { routes } from '@/lib/routes'

type EntrarPageProps = {
  searchParams: Promise<{ code?: string }>
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const { code } = await searchParams
  const defaultRoomCode = code?.trim().toUpperCase() ?? ''

  return (
    <FlowPage
      backHref={routes.home}
      title="Entrar na sala"
      description="Cole o código de 6 letras que veio no link ou no grupo."
    >
      <JoinRoomForm defaultRoomCode={defaultRoomCode} />
    </FlowPage>
  )
}
