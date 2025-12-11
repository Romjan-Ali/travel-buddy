// frontend/app/reviews/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { ReviewsHeader } from '@/components/reviews/ReviewsHeader'
import { ReviewsStats } from '@/components/reviews/ReviewsStats'
import { RatingDistribution } from '@/components/reviews/RatingDistribution'
import { ReviewsTabs } from '@/components/reviews/ReviewsTabs'
import { ReceivedReviewsTab } from '@/components/reviews/ReceivedReviewsTab'
import { GivenReviewsTab } from '@/components/reviews/GivenReviewsTab'
import { ReviewTips } from '@/components/reviews/ReviewTips'
import { EditReviewDialog } from '@/components/reviews/edit-review-dialog'
import type { Review } from '@/types'

export default function ReviewsPage() {
  useProtectedRoute()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [givenReviews, setGivenReviews] = useState<Review[]>([])
  const [receivedReviews, setReceivedReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: [0, 0, 0, 0, 0],
  })

  useEffect(() => {
    fetchReviews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'received' || activeTab === 'all') {
        const receivedData = await reviewAPI.getMyReviews('received')
        setReceivedReviews(receivedData.data.reviews || [])

        setStats((prev) => ({
          ...prev,
          averageRating: receivedData.data.averageRating || 0,
          totalReviews: receivedData.data.totalReviews || 0,
        }))
      }
      if (activeTab === 'given' || activeTab === 'all') {
        const givenData = await reviewAPI.getMyReviews('given')
        setGivenReviews(givenData.data.reviews || [])
      }
    } catch (error) {
      toast.error('Failed to load reviews')
      console.error('Reviews error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this review? This action cannot be undone.'
      )
    )
      return

    try {
      await reviewAPI.delete(reviewId)
      toast.success('Review deleted successfully')
      fetchReviews()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleEditReview = (reviewId: string) => {
    const review = givenReviews.find((r) => r.id === reviewId)
    if (review) {
      setEditingReview(review)
    }
  }

  const handleReviewUpdated = () => {
    toast.success('Review updated successfully!')
    setEditingReview(null)
    fetchReviews()
  }

  // Calculate rating distribution
  const calculateRatingDistribution = (reviews: Review[]) => {
    const distribution = [0, 0, 0, 0, 0]
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating - 1]++
      }
    })
    return distribution
  }

  useEffect(() => {
    if (receivedReviews.length > 0) {
      const distribution = calculateRatingDistribution(receivedReviews)
      setStats((prev) => ({
        ...prev,
        ratingDistribution: distribution,
      }))
    }
  }, [receivedReviews])

  return (
    <div className="container py-8">
      <ReviewsHeader />

      <ReviewsStats
        averageRating={stats.averageRating}
        receivedCount={receivedReviews.length}
        givenCount={givenReviews.length}
        totalReviews={stats.totalReviews}
      />

      <RatingDistribution
        ratingDistribution={stats.ratingDistribution}
        totalReviews={stats.totalReviews}
      />

      <Tabs defaultValue="received" onValueChange={setActiveTab}>
        <ReviewsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          receivedCount={receivedReviews.length}
          givenCount={givenReviews.length}
        />

        <TabsContent value="received">
          <ReceivedReviewsTab
            reviews={receivedReviews}
            currentUserId={user?.id}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="given">
          <GivenReviewsTab
            reviews={givenReviews}
            currentUserId={user?.id}
            isLoading={isLoading}
            onEditReview={handleEditReview}
            onDeleteReview={handleDeleteReview}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Review Dialog */}
      {editingReview && (
        <EditReviewDialog
          reviewId={editingReview.id}
          initialRating={editingReview.rating}
          initialComment={editingReview.comment || ''}
          onReviewUpdated={handleReviewUpdated}
          onOpenChange={(open) => !open && setEditingReview(null)}
          open={!!editingReview}
        />
      )}

      <ReviewTips />
    </div>
  )
}
