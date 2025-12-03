// frontend/app/travel-plans/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { travelPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  travelType: string
  budget: string
  description?: string
  isPublic: boolean
  createdAt: string
  _count: {
    matches: number
  }
}

export default function TravelPlansPage() {
  const router = useRouter()
  const { user } = useProtectedRoute()
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchTravelPlans()
    }
  }, [user])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const result = await travelPlanAPI.getMyPlans()
      setTravelPlans(result.data.plans || [])
    } catch (error) {
      toast.error('Failed to load travel plans')
      console.error('Travel plans error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this travel plan?')) return

    try {
      await travelPlanAPI.delete(id)
      toast.success('Travel plan deleted successfully')
      fetchTravelPlans()
    } catch (error) {
      toast.error('Failed to delete travel plan')
    }
  }

  const getStatus = (startDate: string) => {
    const now = new Date()
    const start = new Date(startDate)

    if (start < now)
      return { label: 'Completed', variant: 'secondary' as const }
    if (start.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return { label: 'Upcoming', variant: 'default' as const }
    }
    return { label: 'Planning', variant: 'outline' as const }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Travel Plans</h1>
          <p className="text-muted-foreground">
            Manage your upcoming adventures and past trips
          </p>
        </div>
        <Link href="/travel-plans/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Travel Plan
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {travelPlans.map((plan) => {
            const status = getStatus(plan.startDate)
            return (
              <Card key={plan.id} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {plan.destination}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(plan.startDate)} -{' '}
                        {formatDate(plan.endDate)}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/travel-plans/${plan.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/travel-plans/${plan.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Badge variant="outline">{plan.travelType}</Badge>
                    </div>

                    {plan.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {plan.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{plan._count.matches} matches</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {plan.budget}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {plan.isPublic ? 'Public' : 'Private'}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push(`/travel-plans/${plan.id}`)}
                      >
                        View Details
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() =>
                          router.push(`/travel-plans/${plan.id}/matches`)
                        }
                      >
                        Find Matches
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No travel plans yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start planning your next adventure! Create a travel plan to find
              compatible travel buddies and organize your trip.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/travel-plans/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Plan
                </Button>
              </Link>
              <Link href="/explore">
                <Button variant="outline" className="gap-2">
                  <Users className="h-4 w-4" />
                  Browse Plans
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
