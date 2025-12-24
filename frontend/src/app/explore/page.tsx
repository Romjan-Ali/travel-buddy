// frontend/app/explore/page.tsx
import { Suspense } from 'react'
import ExploreContent from '@/components/explore/explore-content'
import { Skeleton } from '@/components/ui/skeleton'

export const metadata = {
  title: 'Explore - Travel Buddy',
  description: 'Find your travel buddy and join amazing travel plans',
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoadingSkeleton />}>
      <ExploreContent />
    </Suspense>
  )
}

function ExploreLoadingSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Travel Buddy</h1>
        <p className="text-muted-foreground">
          Discover travelers with similar plans and interests
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-64 rounded-lg mb-4" />
            <Skeleton className="h-4 rounded w-3/4 mb-2" />
            <Skeleton className="h-3 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
