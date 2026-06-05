import { JoinRoomForm } from '@/components/join-room-form'
import { FlowPage } from '@/components/layouts/flow-page'
import { getSelectablePlayers } from '@/features/players/queries'
import { routes } from '@/lib/routes'

type EntrarPageProps = {
  searchParams: Promise<{ code?: string }>
}

export default async function EntrarPage({ searchParams }: EntrarPageProps) {
  const { code } = await searchParams
  const defaultRoomCode = code?.trim().toUpperCase() ?? ''
  const players = await getSelectablePlayers()

  return (
    <FlowPage
      backHref={routes.home}
      title="Entrar na sala"
      description="Use o código que mandaram"
    >
      <JoinRoomForm defaultRoomCode={defaultRoomCode} players={players} />
    </FlowPage>
  )
}
