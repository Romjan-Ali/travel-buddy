// frontend/app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { travelPlanAPI, matchAPI, reviewAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  Calendar,
  Users,
  MapPin,
  Star,
  Plus,
  Clock,
  TrendingUp,
  Briefcase,
  MessageSquare,
  ChevronRight,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface TravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  travelType: string
  description?: string
}

interface Match {
  id: string
  status: string
  initiator?: {
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  receiver?: {
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  travelPlan?: {
    destination: string
  }
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [upcomingPlans, setUpcomingPlans] = useState<TravelPlan[]>([])
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch upcoming travel plans
      const result = await travelPlanAPI.getMyPlans(1, 3)
      const plansData = result.data
      setUpcomingPlans(plansData.plans || [])

      // Fetch recent matches
      const matchesData = await matchAPI.getMyMatches({
        type: 'received',
        status: 'ACCEPTED',
        page: 1,
        limit: 5
      })
      setRecentMatches(matchesData.matches || [])
    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error('Dashboard data error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <div className="container py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user.profile?.fullName || 'Traveler'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your travel plans and connections
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Trips</p>
                <p className="text-2xl font-bold">{upcomingPlans.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Matches</p>
                <p className="text-2xl font-bold">{recentMatches.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Countries Visited
                </p>
                <p className="text-2xl font-bold">
                  {user.profile?.visitedCountries?.length || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Rating</p>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <p className="text-2xl font-bold">4.8</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Travel Plans */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Travel Plans</CardTitle>
                <CardDescription>
                  Your scheduled trips and adventures
                </CardDescription>
              </div>
              <Link href="/travel-plans/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Plan
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading plans...</p>
                </div>
              ) : upcomingPlans.length > 0 ? (
                <div className="space-y-4">
                  {upcomingPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{plan.destination}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(plan.startDate)} -{' '}
                              {formatDate(plan.endDate)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {plan.travelType}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link href={`/travel-plans/${plan.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No upcoming plans</h3>
                  <p className="text-muted-foreground mb-4">
                    Start planning your next adventure
                  </p>
                  <Link href="/travel-plans/new">
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Create Travel Plan
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent matches and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentMatches.length > 0 ? (
                <div className="space-y-4">
                  {recentMatches.slice(0, 3).map((match) => {
                    const otherUser =
                      match.initiator?.profile || match.receiver?.profile
                    return (
                      <div
                        key={match.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {otherUser?.fullName?.charAt(0).toUpperCase() ||
                                'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              Matched with {otherUser?.fullName || 'Traveler'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {match.travelPlan?.destination || 'General match'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="gap-1">
                            <MessageSquare className="h-3 w-3" />
                            Message
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">No recent matches</h3>
                  <p className="text-muted-foreground">
                    Start exploring travelers to find your perfect match
                  </p>
                  <Link href="/explore" className="mt-4 inline-block">
                    <Button variant="outline" className="gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Explore Travelers
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div>
          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get things done faster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/explore">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Users className="h-4 w-4" />
                  Find Travel Buddies
                </Button>
              </Link>
              <Link href="/travel-plans/new">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Travel Plan
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <Link href="/explore?filter=popular">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  Popular Destinations
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Complete your profile for better matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center mb-6">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarImage src={user.profile?.profileImage} />
                  <AvatarFallback className="text-lg">
                    {user.profile?.fullName?.charAt(0).toUpperCase() ||
                      user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">
                  {user.profile?.fullName || 'Traveler'}
                </h3>
                <p className="text-muted-foreground">{user.email}</p>
                {user.profile?.currentLocation && (
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="h-3 w-3" />
                    <span className="text-sm">
                      {user.profile.currentLocation}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">
                      Profile Completion
                    </span>
                    <span className="font-medium">65%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full w-2/3 bg-primary rounded-full"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="font-semibold">
                      {user.profile?.visitedCountries?.length || 0}
                    </div>
                    <div className="text-muted-foreground">Countries</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="font-semibold">{upcomingPlans.length}</div>
                    <div className="text-muted-foreground">Upcoming</div>
                  </div>
                </div>

                <Link href="/profile/edit">
                  <Button className="w-full">Complete Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
