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
