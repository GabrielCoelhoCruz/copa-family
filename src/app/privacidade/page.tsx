import Link from 'next/link'
import { Shield } from 'lucide-react'

import { FlowPage } from '@/components/layouts/flow-page'
import { PageSection } from '@/components/layouts/page-section'
import { routes } from '@/lib/routes'

export const metadata = {
  title: 'Privacidade · Copa Family',
  description: 'Política de privacidade do Copa Family.',
}

export default function PrivacidadePage() {
  return (
    <FlowPage
      backHref={routes.home}
      title="Política de Privacidade"
      description="Como o Copa Family usa seus dados."
    >
      <PageSection variant="plain">
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            O Copa Family é um jogo social para famílias durante a Copa do Mundo.
            Coletamos apenas o necessário para o funcionamento do jogo.
          </p>

          <h3 className="font-heading text-base font-bold text-foreground">
            Dados coletados
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Nome do participante (informado por você ao entrar na sala)</li>
            <li>Avatar/jogador escolhido</li>
            <li>Palpites e pontuação</li>
            <li>Código da sala e participantes</li>
          </ul>

          <h3 className="font-heading text-base font-bold text-foreground">
            Como usamos
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Para exibir o ranking e os palpites dentro da sala</li>
            <li>Para sincronizar o estado do jogo entre os participantes</li>
            <li>Para métricas anônimas de uso (quantas salas foram criadas, etc.)</li>
          </ul>

          <h3 className="font-heading text-base font-bold text-foreground">
            O que não fazemos
          </h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Não vendemos seus dados</li>
            <li>Não usamos para publicidade</li>
            <li>Não exigimos cadastro ou e-mail</li>
            <li>Não compartilhamos com terceiros</li>
          </ul>

          <h3 className="font-heading text-base font-bold text-foreground">
            Armazenamento
          </h3>
          <p>
            Os dados são armazenados no Supabase (banco de dados) e ficam
            disponíveis apenas para os participantes da sala. Ao sair da sala,
            seus dados pessoais podem ser removidos pelo dono da sala.
          </p>

          <h3 className="font-heading text-base font-bold text-foreground">
            Seus direitos (LGPD)
          </h3>
          <p>
            Você pode solicitar a exclusão dos seus dados a qualquer momento.
            Entre em contato pelo repositório do projeto no GitHub.
          </p>

          <p className="pt-2 text-xs text-muted-foreground/70">
            Última atualização: junho de 2026
          </p>
        </div>
      </PageSection>

      <div className="mt-6">
        <Link
          href={routes.home}
          className="text-sm font-medium text-brand-sky hover:underline"
        >
          ← Voltar para o Copa Family
        </Link>
      </div>
    </FlowPage>
  )
}
