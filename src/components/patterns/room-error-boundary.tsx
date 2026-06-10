'use client'

import { Component, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/patterns/empty-state'

type Props = {
  children: ReactNode
  roomCode?: string
}

type State = {
  hasError: boolean
  error: Error | null
}

class RoomErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error('[RoomErrorBoundary] Caught error:', error)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <EmptyState
            icon={<AlertTriangle className="size-6" />}
            title="Algo deu errado"
            description="Ocorreu um problema ao carregar a sala. Tente novamente ou recarregue a página."
            action={
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="party"
                  className="cf-pressable min-h-11"
                  onClick={this.handleRetry}
                >
                  <RotateCcw className="size-4" aria-hidden />
                  Tentar novamente
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="cf-pressable min-h-11"
                  onClick={this.handleReload}
                >
                  Recarregar página
                </Button>
              </div>
            }
          />
        </div>
      )
    }

    return this.props.children
  }
}

export { RoomErrorBoundary }
