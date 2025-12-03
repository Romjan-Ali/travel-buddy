// frontend/app/explore/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { travelPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Star,
  Filter,
  Globe,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface TravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  travelType: string
  budget: string
  description?: string
  user: {
    id: string
    profile?: {
      fullName: string
      profileImage?: string
      currentLocation?: string
      travelInterests?: string[]
    }
    averageRating?: number
    reviewCount?: number
  }
  _count: {
    matches: number
  }
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filters, setFilters] = useState({
    destination: searchParams.get('destination') || '',
    travelType: searchParams.get('travelType') || '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  console.log('travel plans:', travelPlans)

  useEffect(() => {
    fetchTravelPlans()
  }, [filters, page])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )

      const result = await travelPlanAPI.search(activeFilters, page, 9)
      const data = result.data

      setTravelPlans(data.plans || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load travel plans')
      console.error('Explore error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTravelPlans()
  }

  const handleReset = () => {
    setFilters({
      destination: '',
      travelType: '',
      startDate: '',
      endDate: '',
    })
    setPage(1)
  }

  const travelTypes = ['SOLO', 'FAMILY', 'FRIENDS', 'COUPLE', 'BUSINESS']

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Travel Buddy</h1>
        <p className="text-muted-foreground">
          Discover travelers with similar plans and interests
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Destination */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Destination
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Where are you going?"
                    className="pl-10"
                    value={filters.destination}
                    onChange={(e) =>
                      handleFilterChange('destination', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Travel Type */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Travel Type
                </label>
                <Select
                  value={filters.travelType}
                  onValueChange={(value) =>
                    handleFilterChange('travelType', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* <SelectItem value="">Any type</SelectItem> */}
                    {travelTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0) + type.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange('startDate', e.target.value)
                    }
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  End Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-10"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange('endDate', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <Filter className="h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Available Travel Plans{' '}
            {travelPlans.length > 0 && `(${travelPlans.length})`}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-6"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : travelPlans.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {travelPlans.map((plan) => (
                <Card key={plan.id} className="card-hover group">
                  <CardContent className="p-6">
                    {/* Destination & Host */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">
                          {plan.destination}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={plan.user.profile?.profileImage}
                            />
                            <AvatarFallback>
                              {plan.user.profile?.fullName
                                ?.charAt(0)
                                .toUpperCase() || 'T'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {plan.user.profile?.fullName || 'Traveler'}
                            </p>
                            {plan.user.averageRating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                                <span className="text-xs">
                                  {plan.user.averageRating.toFixed(1)} (
                                  {plan.user.reviewCount})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Badge>{plan.travelType}</Badge>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {formatDate(plan.startDate)} -{' '}
                        {formatDate(plan.endDate)}
                      </span>
                    </div>

                    {/* Budget */}
                    <div className="mb-4">
                      <Badge variant="outline" className="text-sm">
                        Budget: {plan.budget}
                      </Badge>
                    </div>

                    {/* Description */}
                    {plan.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{plan._count.matches} matches</span>
                        </div>
                        {plan.user.profile?.currentLocation && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{plan.user.profile.currentLocation}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button className="flex-1 gap-2" size="sm">
                        <MessageSquare className="h-4 w-4" />
                        Request to Join
                      </Button>
                      <Button variant="outline" size="sm" className="px-3">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                No travel plans found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search filters or create your own travel plan
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleReset}>
                  Clear Filters
                </Button>
                <Button>Create Travel Plan</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Destinations</CardTitle>
          <CardDescription>Where travelers are heading next</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              'Tokyo',
              'Bali',
              'Paris',
              'New York',
              'Bangkok',
              'Sydney',
              'London',
              'Barcelona',
              'Rome',
              'Dubai',
              'Singapore',
              'Istanbul',
            ].map((city) => (
              <Button
                key={city}
                variant="outline"
                className="h-auto py-3 flex-col gap-2"
                onClick={() => handleFilterChange('destination', city)}
              >
                <Globe className="h-5 w-5" />
                <span>{city}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
