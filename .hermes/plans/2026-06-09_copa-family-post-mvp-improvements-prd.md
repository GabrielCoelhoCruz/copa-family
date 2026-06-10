# Copa Family — Post-MVP Improvements PRD

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Implement 5 high-impact improvements to Copa Family: WhatsApp share button, loading skeleton, error boundaries, service worker for offline support, and a privacy notice footer.

**Architecture:** Each improvement is self-contained and follows existing patterns from `DESIGN.md` and `LAYOUT.md`. All new components go in `src/components/patterns/`. No new dependencies needed.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui, Supabase (existing)

---

## Problem Statement

The current Copa Family V1 has gaps in shareability, resilience, offline support, and legal compliance:

1. **No easy WhatsApp sharing** — Hosts can copy a link or show a QR code, but the primary way Brazilian families communicate is WhatsApp. Adding a one-tap "share to WhatsApp" button removes friction at the most critical moment (inviting the family).
2. **No loading states** — The landing page is fully client-side rendered. On slow connections, users see a blank screen while JS hydrates, which feels broken.
3. **No error recovery** — If a client-side error crashes the room page, users see a blank screen with no way to recover without manually reloading.
4. **No offline support** — The PWA manifest is set up but there's no service worker. Users who "install" the app get no offline capability or caching benefits.
5. **No privacy policy** — The app collects user data (names, avatars, predictions) but has no privacy notice. This is a compliance risk under Brazilian LGPD law.

## Solution

Five independent improvements that each address one of the above problems:

1. **WhatsApp Share Button** — Add a third button ("Compartilhar no WhatsApp") to the room invite card that opens `wa.me` with a pre-filled message containing the room code and invite link.
2. **Loading Skeleton** — Add a React `<Suspense>` boundary around the landing page that shows a skeleton layout while JS hydrates.
3. **Error Boundary** — Add a React error boundary around room pages that catches client-side crashes and shows a friendly error state with retry/reload actions.
4. **Service Worker** — Register a service worker for the PWA that provides cache-first for static assets and network-first for API calls, enabling offline support.
5. **Privacy Policy Page** — Add a `/privacidade` page with LGPD-compliant privacy notice, linked from the landing page footer.

## User Stories

1. As a **host**, I want to share my room code directly to WhatsApp, so that I can invite the family group in one tap instead of copying and pasting manually.
2. As a **new visitor on a slow connection**, I want to see a loading skeleton while the page loads, so that I know the app is working and not broken.
3. As a **family member in a room**, I want to see a friendly error message with retry options if something crashes, so that I don't lose my place in the game.
4. As a **PWA user**, I want the app to work offline and load faster on repeat visits, so that I can check scores even with poor connectivity.
5. As a **privacy-conscious user**, I want to read a clear privacy policy, so that I understand what data is collected and how it's used.
6. As the **app owner**, I want a published privacy notice, so that I'm compliant with Brazilian LGPD regulations.

## Implementation Decisions

- WhatsApp sharing uses the `wa.me` deep link (no API needed, works on mobile and desktop)
- Loading skeleton uses React 19's native `<Suspense>` boundary (no new dependencies)
- Error boundary is a class component using `getDerivedStateFromError` (standard React pattern)
- Service worker follows cache-first for static assets, network-first for API routes
- Privacy page is a static `FlowPage` using existing layout primitives (no new layout code)
- All new components follow existing `DESIGN.md` tokens — no ad-hoc hex colors
- Room invite card button grid changes from 2-column to 3-column layout

## Testing Decisions

- **Good tests** verify external behavior: does the WhatsApp URL encode correctly? Does the error boundary catch and render? Does the privacy page render at the correct route?
- **Avoid** testing implementation details like internal component state or specific CSS class names
- **Prior art**: `src/lib/user-avatar.test.ts`, `src/lib/copa-pare-categories.test.ts`, `src/features/fixtures/queries.test.ts`
- WhatsApp share utility gets unit tests (pure functions, easy to test)
- Service worker is tested manually via browser DevTools (standard practice)
- Error boundary and skeleton are verified via build + visual inspection

## Out of Scope

- Push notifications (explicitly out of scope per PRODUCT.md)
- Analytics tracking on share events
- iMessage / Telegram / other share targets (WhatsApp only for V1)
- Advanced service worker strategies (background sync, periodic sync)
- Privacy policy with user data export/deletion self-service (manual contact for now)
- Cookie consent banner (not needed — no cookies used, data is in Supabase + localStorage)

## Further Notes

- Each improvement is independently deployable — no cross-dependencies
- The order of implementation doesn't matter, but WhatsApp share is likely the highest-impact item for user acquisition
- All improvements respect the `PRODUCT.md` anti-references (no SaaS patterns, no generic UI)
- The service worker cache version must be bumped on each deploy to avoid stale content
