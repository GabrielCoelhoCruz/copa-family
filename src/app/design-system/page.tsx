import type { Metadata } from 'next'

import { DesignSystemScreen } from '@/components/design-system/design-system-screen'

export const metadata: Metadata = {
  title: 'Design System · Copa Family',
  description:
    'Tokens, tipografia e componentes da Variação C (Estádio) integrados ao app.',
}

export default function DesignSystemPage() {
  return <DesignSystemScreen />
}
