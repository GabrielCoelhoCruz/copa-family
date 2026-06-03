import type { Metadata } from 'next'

import { CreateRoomForm } from '@/components/create-room-form'
import { FlowPage } from '@/components/layouts/flow-page'
import { fixtureDisplayTitle } from '@/features/fixtures/format'
import { getFixtureById, getWorldCupCatalogFixtures } from '@/features/fixtures/queries'
import { routes } from '@/lib/routes'

type CriarSalaPageProps = {
  searchParams: Promise<{ fixture?: string }>
}

export async function generateMetadata({
  searchParams,
}: CriarSalaPageProps): Promise<Metadata> {
  const { fixture } = await searchParams

  if (!fixture) {
    return {
      title: 'Criar sala · Copa Family',
      description: 'Crie uma sala para palpites da família na Copa.',
    }
  }

  const selectedFixture = await getFixtureById(fixture)
  if (!selectedFixture) {
    return {
      title: 'Criar sala · Copa Family',
      description: 'Crie uma sala para palpites da família na Copa.',
    }
  }

  const matchTitle = fixtureDisplayTitle(selectedFixture)
  const title = `${matchTitle} · Copa Family`
  const description = `Abra uma sala para ${matchTitle}: palpites antes do jogo e Copa Pare no intervalo.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function CriarSalaPage({ searchParams }: CriarSalaPageProps) {
  const { fixture: fixtureParam } = await searchParams
  const fixtures = await getWorldCupCatalogFixtures()
  const defaultFixtureId =
    fixtureParam && fixtures.some((f) => f.id === fixtureParam)
      ? fixtureParam
      : undefined

  return (
    <FlowPage
      backHref={routes.calendario}
      title="Criar sala"
      description={
        defaultFixtureId
          ? 'Jogo pré-selecionado do calendário. Confirme o nome da sala e crie.'
          : 'Em menos de um minuto você cria a sala e manda o link no grupo.'
      }
    >
      <CreateRoomForm fixtures={fixtures} defaultFixtureId={defaultFixtureId} />
    </FlowPage>
  )
}
