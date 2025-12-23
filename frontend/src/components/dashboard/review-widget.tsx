// frontend/components/dashboard/review-widget.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Star, Users, Calendar, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ReviewWidgetProps {
  pendingReviews: number
  averageRating: number
  totalReviews: number
}

export function ReviewWidget({
  pendingReviews = 0,
  averageRating = 0,
  totalReviews = 0,
}: ReviewWidgetProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Reviews
          </span>
          {pendingReviews > 0 && (
            <span className="text-sm font-normal bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-1 rounded-full">
              {pendingReviews} pending
            </span>
          )}
        </CardTitle>
        <CardDescription>
          Manage your reviews and see your rating
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rating Summary */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalReviews}</p>
              <p className="text-sm text-muted-foreground">Total Reviews</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Rating Progress</span>
              <span className="text-sm font-medium">
                {((averageRating / 5) * 100).toFixed(0)}%
              </span>
            </div>
            <Progress value={(averageRating / 5) * 100} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant={pendingReviews > 0 ? "default" : "outline"}
              className="gap-2"
              onClick={() => router.push('/reviews')}
            >
              <Star className="h-4 w-4" />
              {pendingReviews > 0 ? `Review (${pendingReviews})` : 'My Reviews'}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push('/reviews?tab=given')}
            >
              <Users className="h-4 w-4" />
              Given
            </Button>
          </div>

          {/* Quick Stats */}
          {pendingReviews > 0 && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Review Opportunities</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Trip to Paris</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-8"
                  onClick={() => router.push('/reviews')}
                >
                  Review
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}