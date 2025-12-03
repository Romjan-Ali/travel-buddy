'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Star, User, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function ReviewsPage() {
  useProtectedRoute()
  const [activeTab, setActiveTab] = useState('received')
  const [givenReviews, setGivenReviews] = useState<any[]>([])
  const [receivedReviews, setReceivedReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [activeTab])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'received' || activeTab === 'all') {
        const receivedData = await reviewAPI.getMyReviews('received')
        console.log('Received reviews data:', receivedData)
        setReceivedReviews(receivedData.reviews || [])
      }
      if (activeTab === 'given' || activeTab === 'all') {
        const givenData = await reviewAPI.getMyReviews('given')
        setGivenReviews(givenData.reviews || [])
      }
    } catch (error) {
      toast.error('Failed to load reviews')
      console.error('Reviews error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await reviewAPI.delete(reviewId)
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reviews</h1>
        <p className="text-muted-foreground">
          See what others say about you and manage your reviews
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {calculateAverageRating(receivedReviews)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(parseFloat(calculateAverageRating(receivedReviews)))
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {receivedReviews.length}
              </div>
              <div className="h-12 w-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm text-muted-foreground">Reviews Received</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {givenReviews.length}
              </div>
              <div className="h-12 w-12 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm text-muted-foreground">Reviews Given</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="received" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="received" className="gap-2">
            <User className="h-4 w-4" />
            Received ({receivedReviews.length})
          </TabsTrigger>
          <TabsTrigger value="given" className="gap-2">
            <Star className="h-4 w-4" />
            Given ({givenReviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>Reviews About You</CardTitle>
              <CardDescription>
                What other travelers say about traveling with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading reviews...</p>
                </div>
              ) : receivedReviews.length > 0 ? (
                <div className="space-y-6">
                  {receivedReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.author?.profile?.profileImage} />
                            <AvatarFallback>
                              {review.author?.profile?.fullName?.charAt(0).toUpperCase() || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">
                              {review.author?.profile?.fullName || 'Anonymous'}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-muted-foreground mb-4">{review.comment}</p>
                      )}
                      
                      {review.travelPlan && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{review.travelPlan.destination}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>{formatDate(review.travelPlan.startDate)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete trips with other travelers to receive reviews
                  </p>
                  <Button>
                    <Calendar className="mr-2 h-4 w-4" />
                    Plan Your Next Trip
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="given">
          <Card>
            <CardHeader>
              <CardTitle>Reviews You've Given</CardTitle>
              <CardDescription>
                Reviews you've written for other travelers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading reviews...</p>
                </div>
              ) : givenReviews.length > 0 ? (
                <div className="space-y-6">
                  {givenReviews.map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.subject?.profile?.profileImage} />
                            <AvatarFallback>
                              {review.subject?.profile?.fullName?.charAt(0).toUpperCase() || 'T'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">
                              {review.subject?.profile?.fullName || 'Traveler'}
                            </h4>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Review
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteReview(review.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Review
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {review.comment && (
                        <p className="text-muted-foreground mb-4">{review.comment}</p>
                      )}
                      
                      {review.travelPlan && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{review.travelPlan.destination}</span>
                          <Calendar className="h-3 w-3 ml-2" />
                          <span>{formatDate(review.travelPlan.startDate)}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        Posted {formatDate(review.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Star className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No reviews given</h3>
                  <p className="text-muted-foreground">
                    Complete trips with other travelers to leave reviews
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}