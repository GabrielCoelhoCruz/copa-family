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
