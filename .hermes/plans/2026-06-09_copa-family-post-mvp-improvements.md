# Copa Family — Post-MVP Improvements Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Implement 5 high-impact improvements to Copa Family: WhatsApp share button, loading skeleton, error boundaries, service worker for offline support, and a privacy notice footer.

**Architecture:** Each improvement is self-contained and follows existing patterns from `DESIGN.md` and `LAYOUT.md`. All new components go in `src/components/patterns/`. No new dependencies needed.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, Supabase (existing)

---

## Task 1: WhatsApp Share Button on Room Invite

**Objective:** Add a "Compartilhar no WhatsApp" button alongside the existing "Copiar link" and "QR Code" buttons in the room invite card, so hosts can quickly share the room code in family group chats.

**Files:**
- Modify: `src/components/patterns/room-code-display.tsx`
- Create: `src/lib/whatsapp-share.ts`
- Test: `src/lib/whatsapp-share.test.ts`

**Step 1: Create the WhatsApp share utility**

Create `src/lib/whatsapp-share.ts`:

```typescript
const WHATSAPP_BASE = 'https://wa.me/'

type WhatsAppShareInput = {
  text: string
}

export function buildWhatsAppShareUrl(input: WhatsAppShareInput): string {
  const encoded = encodeURIComponent(input.text)
  return `${WHATSAPP_BASE}?text=${encoded}`
}

export function buildRoomInviteWhatsAppText(roomCode: string, inviteUrl: string): string {
  const code = roomCode.toUpperCase()
  return [
    `Vem jogar Copa Family com a gente! 🏆`,
    ``,
    `Código da sala: ${code}`,
    ``,
    `Entrar: ${inviteUrl}`,
  ].join('\n')
}
```

**Step 2: Write failing test**

Create `src/lib/whatsapp-share.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { buildWhatsAppShareUrl, buildRoomInviteWhatsAppText } from './whatsapp-share'

describe('buildWhatsAppShareUrl', () => {
  it('encodes text into wa.me URL', () => {
    const url = buildWhatsAppShareUrl({ text: 'Hello world' })
    expect(url).toBe('https://wa.me/?text=Hello%20world')
  })

  it('handles special characters', () => {
    const url = buildWhatsAppShareUrl({ text: 'Copa & Família! 🏆' })
    expect(url).toContain('Copa%20%26%20Fam%C3%ADlia!')
  })
})

describe('buildRoomInviteWhatsAppText', () => {
  it('includes room code and invite URL', () => {
    const text = buildRoomInviteWhatsAppText('abc123', 'https://copa-family.vercel.app/entrar?code=ABC123')
    expect(text).toContain('ABC123')
    expect(text).toContain('https://copa-family.vercel.app/entrar?code=ABC123')
    expect(text).toContain('Copa Family')
  })

  it('uppercases the room code', () => {
    const text = buildRoomInviteWhatsAppText('xyz789', 'https://example.com')
    expect(text).toContain('XYZ789')
    expect(text).not.toContain('xyz789')
  })
})
```

**Step 3: Run test to verify failure**

Run: `npx vitest run src/lib/whatsapp-share.test.ts -v`
Expected: FAIL — "Cannot find module './whatsapp-share'"

**Step 4: Implement the utility (already done in Step 1)**

**Step 5: Run test to verify pass**

Run: `npx vitest run src/lib/whatsapp-share.test.ts -v`
Expected: PASS — 3 passed

**Step 6: Add WhatsApp button to RoomCodeDisplay**

Modify `src/components/patterns/room-code-display.tsx`:

Add import:
```typescript
import { MessageCircle } from 'lucide-react'
import { buildRoomInviteWhatsAppText } from '@/lib/whatsapp-share'
import { buildWhatsAppShareUrl } from '@/lib/whatsapp-share'
```

Add `whatsappUrl` computation inside the component:
```typescript
const whatsappText = buildRoomInviteWhatsAppText(roomCode, inviteUrl)
const whatsappUrl = buildWhatsAppShareUrl({ text: whatsappText })
```

Change the button grid from `grid-cols-2` to `grid-cols-3` and add the WhatsApp button as the third item:
```tsx
<div className="grid grid-cols-3 gap-2">
  <RoomCopyButton inviteUrl={inviteUrl} />
  <Link
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Compartilhar no WhatsApp"
    className={cn(
      buttonVariants({ variant: 'outline' }),
      'min-h-11'
    )}
  >
    <MessageCircle />
    WhatsApp
  </Link>
  <Link
    href={qrHref}
    scroll={false}
    data-testid="toggle-room-qr"
    aria-label={showQr ? 'Fechar QR Code' : 'Mostrar QR Code'}
    className={cn(
      buttonVariants({ variant: showQr ? 'default' : 'outline' }),
      'min-h-11'
    )}
  >
    <QrCode />
    {showQr ? 'Fechar QR' : 'QR Code'}
  </Link>
</div>
```

**Step 7: Verify build**

Run: `npm run build`
Expected: PASS

**Step 8: Commit**

```bash
git add src/lib/whatsapp-share.ts src/lib/whatsapp-share.test.ts src/components/patterns/room-code-display.tsx
git commit -m "feat: add WhatsApp share button to room invite card"
```

---

## Task 2: Loading Skeleton for Landing Page

**Objective:** Add a skeleton loading state that shows while the landing page JS hydrates, preventing a flash of empty content on slow connections.

**Files:**
- Create: `src/components/patterns/home-landing-skeleton.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create the skeleton component**

Create `src/components/patterns/home-landing-skeleton.tsx`:

```tsx
function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-3xl bg-white/[0.07] ${className ?? ''}`}
      aria-hidden
    />
  )
}

function HomeLandingSkeleton() {
  return (
    <div
      className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col font-sans text-white"
      aria-label="Carregando Copa Family"
    >
      <div className="relative z-10 flex min-h-dvh flex-col">
        <main className="space-y-0 px-[18px] pb-0 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <div className="space-y-3.5">
            {/* Hero card */}
            <SkeletonBlock className="h-[180px]" />
            {/* Match preview card */}
            <SkeletonBlock className="h-[140px]" />
            {/* Social proof card */}
            <SkeletonBlock className="h-[120px]" />
          </div>
          {/* How it works section */}
          <div className="mt-[26px] space-y-2.5">
            <SkeletonBlock className="mb-3 h-6 w-32" />
            <SkeletonBlock className="h-[62px]" />
            <SkeletonBlock className="h-[62px]" />
            <SkeletonBlock className="h-[62px]" />
          </div>
          {/* Points section */}
          <div className="mt-[26px] space-y-2.5">
            <SkeletonBlock className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-2.5">
              <SkeletonBlock className="h-[100px]" />
              <SkeletonBlock className="h-[100px]" />
              <SkeletonBlock className="h-[100px]" />
              <SkeletonBlock className="h-[100px]" />
            </div>
          </div>
        </main>
        {/* Sticky footer */}
        <footer className="sticky bottom-0 z-20 shrink-0 px-[18px] pb-[max(1rem,env(safe-area-inset-bottom))] pt-3.5">
          <div className="space-y-2.5">
            <SkeletonBlock className="h-14 w-full rounded-[32px]" />
            <SkeletonBlock className="h-2.5 w-full" />
            <SkeletonBlock className="min-h-14 w-full rounded-[32px]" />
          </div>
        </footer>
      </div>
    </div>
  )
}

export { HomeLandingSkeleton }
```

**Step 2: Update page.tsx to use Suspense boundary**

Modify `src/app/page.tsx`:

```tsx
import { Suspense } from 'react'
import { HomeLandingScreen } from '@/components/patterns/home-landing-screen'
import { HomeLandingSkeleton } from '@/components/patterns/home-landing-skeleton'

export default function Home() {
  return (
    <div className="home-stadium-bg min-h-dvh w-full">
      <Suspense fallback={<HomeLandingSkeleton />}>
        <HomeLandingScreen />
      </Suspense>
    </div>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/patterns/home-landing-skeleton.tsx src/app/page.tsx
git commit -m "feat: add loading skeleton for landing page hydration"
```

---

## Task 3: Error Boundary for Room Pages

**Objective:** Add a React error boundary around the room game board so that if a client-side error occurs, users see a friendly "something went wrong" message with a retry button instead of a blank screen.

**Files:**
- Create: `src/components/patterns/room-error-boundary.tsx`
- Modify: `src/app/sala/[roomCode]/layout.tsx`

**Step 1: Create the error boundary component**

Create `src/components/patterns/room-error-boundary.tsx`:

```tsx
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
            icon={AlertTriangle}
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
```

**Step 2: Wrap the sala layout with the error boundary**

Modify `src/app/sala/[roomCode]/layout.tsx` — wrap the children with `RoomErrorBoundary`:

```tsx
import { RoomErrorBoundary } from '@/components/patterns/room-error-boundary'

// ... existing imports ...

export default async function SalaLayout({ children, params }: SalaLayoutProps) {
  const { roomCode } = await params

  return (
    <RoomErrorBoundary roomCode={roomCode}>
      {/* ... existing layout JSX ... */}
    </RoomErrorBoundary>
  )
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: PASS

**Step 4: Commit**

```bash
git add src/components/patterns/room-error-boundary.tsx src/app/sala/[roomCode]/layout.tsx
git commit -m "feat: add error boundary for room pages with retry and reload actions"
```

---

## Task 4: Service Worker for Offline Support

**Objective:** Add a service worker so the PWA can work offline and load faster on repeat visits, fulfilling the PWA promise already set up by the manifest.

**Files:**
- Create: `public/sw.js`
- Create: `src/lib/register-sw.ts`
- Modify: `src/app/layout.tsx`

**Step 1: Create the service worker**

Create `public/sw.js`:

```javascript
const CACHE_NAME = 'copa-family-v1'
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
]

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  )
  self.clients.claim()
})

// Fetch: network-first for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip Supabase and analytics requests
  if (
    url.hostname.includes('supabase') ||
    url.pathname.includes('/api/analytics')
  ) {
    return
  }

  // API routes: network first, fallback to offline page
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'offline' }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        )
      })
    )
    return
  }

  // Static assets and pages: cache first, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Cache successful responses
        if (response.ok && response.type === 'basic') {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone)
          })
        }
        return response
      }).catch(() => {
        // Fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/')
        }
        return new Response('Offline', { status: 503 })
      })
    })
  )
})
```

**Step 2: Create the SW registration utility**

Create `src/lib/register-sw.ts`:

```typescript
export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[SW] Registered:', registration.scope)

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'activated') {
                console.log('[SW] New version activated')
              }
            })
          }
        })
      })
      .catch((error) => {
        console.warn('[SW] Registration failed:', error)
      })
  })
}

export function unregisterServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}
```

**Step 3: Add SW registration to the root layout**

Modify `src/app/layout.tsx` — add a script tag that registers the SW:

```tsx
import { registerServiceWorker } from '@/lib/register-sw'

// Add inside RootLayout, before </body>:
<script
  dangerouslySetInnerHTML={{
    __html: `(${registerServiceWorker.toString()})()`,
  }}
/>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add public/sw.js src/lib/register-sw.ts src/app/layout.tsx
git commit -m "feat: add service worker for offline PWA support"
```

---

## Task 5: Privacy Notice Footer

**Objective:** Add a small privacy notice link in the landing page footer, linking to a simple privacy policy page — important for LGPD compliance in Brazil.

**Files:**
- Create: `src/app/privacidade/page.tsx`
- Modify: `src/components/patterns/home-landing-screen.tsx`
- Modify: `src/lib/routes.ts`

**Step 1: Add the privacy route**

Modify `src/lib/routes.ts` — add:

```typescript
privacidade: '/privacidade',
```

**Step 2: Create the privacy page**

Create `src/app/privacidade/page.tsx`:

```tsx
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
      title="Política de Privacidade"
      description="Como o Copa Family usa seus dados."
    >
      <PageSection surface="plain">
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
```

**Step 3: Add privacy link to landing page footer**

Modify `src/components/patterns/home-landing-screen.tsx` — in the footer section, add a privacy link next to the "Design system" link:

```tsx
<p className="mt-2.5 text-center text-xs text-[var(--home-faint)]">
  Sem cadastro · comece em menos de 1 minuto
  {' · '}
  <Link
    href={routes.privacidade}
    className="text-[var(--home-muted)] underline-offset-2 hover:text-[var(--home-gold)] hover:underline"
  >
    Privacidade
  </Link>
  {' · '}
  <Link
    href={routes.designSystem}
    className="text-[var(--home-muted)] underline-offset-2 hover:text-[var(--home-gold)] hover:underline"
  >
    Design system
  </Link>
</p>
```

Add the import for `routes` if not already present (it is — line 20).

**Step 4: Verify build**

Run: `npm run build`
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/privacidade/page.tsx src/components/patterns/home-landing-screen.tsx src/lib/routes.ts
git commit -m "feat: add privacy policy page and footer link (LGPD compliance)"
```

---

## Verification Checklist

After all tasks are complete:

- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx vitest run` passes (including new WhatsApp share tests)
- [ ] `npm run design:ci` passes
- [ ] Landing page shows skeleton while loading (test with DevTools network throttling)
- [ ] Room invite card has 3 buttons: Copiar link, WhatsApp, QR Code
- [ ] WhatsApp button opens wa.me with pre-filled message containing room code
- [ ] Room error boundary catches errors and shows retry/reload options
- [ ] Service worker registers in browser DevTools → Application → Service Workers
- [ ] Privacy page is accessible at `/privacidade` and linked from landing footer
- [ ] All new components follow `DESIGN.md` tokens (no ad-hoc hex colors)
- [ ] Touch targets ≥ 44px on new buttons

## Risks & Tradeoffs

- **Service worker**: Cache-first strategy means users might see stale content after deploys. Mitigated by cache-busting via versioned cache name (`copa-family-v1`). Bump version on each release.
- **Error boundary**: `getDerivedStateFromError` doesn't catch async errors or event handlers. For a V1 improvement this is acceptable; consider `react-error-boundary` library for more robust handling later.
- **WhatsApp share**: `wa.me` link works on both mobile and desktop. On desktop it opens WhatsApp Web. No tracking of whether the share was completed (by design — privacy).
- **Privacy page**: Static content, manually maintained. If the data practices change, this page needs to be updated.
