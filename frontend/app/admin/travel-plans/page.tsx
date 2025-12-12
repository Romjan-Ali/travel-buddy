// frontend/app/admin/travel-plans/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Users,
  Globe,
  Eye,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'sonner'
import { formatDate, calculateDaysBetween } from '@/lib/utils'

interface AdminTravelPlan {
  id: string
  destination: string
  startDate: string
  endDate: string
  travelType: string
  budget: string
  isPublic: boolean
  createdAt: string
  user: {
    id: string
    email: string
    profile?: {
      fullName: string
      profileImage?: string
    }
  }
  _count?: {
    matches: number
  }
}

export default function AdminTravelPlansPage() {
  const [travelPlans, setTravelPlans] = useState<AdminTravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedVisibility, setSelectedVisibility] = useState<'all' | 'public' | 'private'>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'upcoming' | 'past'>('all')

  useEffect(() => {
    fetchTravelPlans()
  }, [page, selectedVisibility, selectedStatus])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}
      if (searchQuery) filters.search = searchQuery
      if (selectedVisibility !== 'all') filters.visibility = selectedVisibility
      if (selectedStatus !== 'all') filters.status = selectedStatus

      const result = await adminAPI.getAllTravelPlans(page, 20, filters)
      setTravelPlans(result.data?.travelPlans || [])
      setTotalPages(result.data?.pagination?.pages || 1)
    } catch (error) {
      toast.error('Failed to load travel plans')
      console.error('Admin travel plans error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTravelPlans()
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this travel plan? This will also delete all associated matches and reviews.')) {
      return
    }

    try {
      await adminAPI.deleteTravelPlan(planId)
      toast.success('Travel plan deleted successfully')
      fetchTravelPlans()
    } catch (error) {
      toast.error('Failed to delete travel plan')
    }
  }

  const handleExport = () => {
    toast.info('Export feature coming soon!')
  }

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date()
  }

  const stats = {
    total: travelPlans.length,
    upcoming: travelPlans.filter(p => isUpcoming(p.startDate)).length,
    past: travelPlans.filter(p => !isUpcoming(p.startDate)).length,
    public: travelPlans.filter(p => p.isPublic).length,
    private: travelPlans.filter(p => !p.isPublic).length
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Travel Plan Management</h1>
        <p className="text-muted-foreground">
          Manage all travel plans created by users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Plans</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Public Plans</p>
                <p className="text-2xl font-bold">{stats.public}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Past Plans</p>
                <p className="text-2xl font-bold">{stats.past}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by destination, user..."
                  className="pl-10 w-full lg:w-96"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Visibility:</span>
                <div className="flex gap-1">
                  {['all', 'public', 'private'].map((visibility) => (
                    <Button
                      key={visibility}
                      size="sm"
                      variant={selectedVisibility === visibility ? "default" : "outline"}
                      onClick={() => setSelectedVisibility(visibility as any)}
                    >
                      {visibility.charAt(0).toUpperCase() + visibility.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex gap-1">
                  {['all', 'upcoming', 'past'].map((status) => (
                    <Button
                      key={status}
                      size="sm"
                      variant={selectedStatus === status ? "default" : "outline"}
                      onClick={() => setSelectedStatus(status as any)}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <Button variant="outline" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Travel Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Plans</CardTitle>
          <CardDescription>
            Manage all travel plans in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
              ))}
            </div>
          ) : travelPlans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Destination</th>
                    <th className="text-left py-3 px-4 font-medium">Organizer</th>
                    <th className="text-left py-3 px-4 font-medium">Dates</th>
                    <th className="text-left py-3 px-4 font-medium">Type</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Visibility</th>
                    <th className="text-left py-3 px-4 font-medium">Matches</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {travelPlans.map((plan) => {
                    const upcoming = isUpcoming(plan.startDate)
                    const daysBetween = calculateDaysBetween(new Date(plan.startDate), new Date(plan.endDate))

                    return (
                      <tr key={plan.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{plan.destination}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {daysBetween} days • {plan.budget}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              {plan.user.profile?.profileImage ? (
                                <img 
                                  src={plan.user.profile.profileImage} 
                                  alt={plan.user.profile.fullName}
                                  className="h-8 w-8 rounded-full"
                                />
                              ) : (
                                <Users className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {plan.user.profile?.fullName || 'Anonymous'}
                              </p>
                              <p className="text-xs text-muted-foreground">{plan.user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(plan.startDate)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              to {formatDate(plan.endDate)}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{plan.travelType}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={upcoming ? "default" : "secondary"}>
                            {upcoming ? 'Upcoming' : 'Past'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={plan.isPublic ? "default" : "outline"}>
                            {plan.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{plan._count?.matches || 0}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link href={`/travel-plans/${plan.id}`}>
                              <Button size="sm" variant="outline" className="gap-1">
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(plan.id)}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No travel plans found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}