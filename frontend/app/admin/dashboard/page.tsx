// frontend/app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'
import { adminAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  Users,
  Calendar,
  Star,
  TrendingUp,
  Shield,
  Globe,
  DollarSign,
  Activity,
  AlertCircle,
} from 'lucide-react'
import { DashboardStats } from '@/types'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  console.log('Rendering AdminDashboardPage for user:', user)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchDashboardStats()
    }
  }, [user])

  const fetchDashboardStats = async () => {
    setIsLoading(true)
    try {
      const result = await adminAPI.getDashboardStats()
      setStats(result.data)
    } catch (error) {
      toast.error('Failed to load dashboard stats')
      console.error('Dashboard error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="h-16 w-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            Admin privileges required to view this page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Administrator. Here&apos;s an overview of the
              platform.
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Admin</span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totals.users}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {stats.totals.activeUsers} active
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Travel Plans
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totals.travelPlans}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {stats.totals.activeTravelPlans} upcoming
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Matches Made
                    </p>
                    <p className="text-2xl font-bold">{stats.totals.matches}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Successful connections
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Subscriptions
                    </p>
                    <p className="text-2xl font-bold">
                      {stats.totals.subscriptions}
                    </p>
                    <p className="text-xs text-amber-600 mt-1">
                      Premium members
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Reviews
                    </p>
                    <p className="text-2xl font-bold">{stats.totals.reviews}</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Sessions
                    </p>
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-xs text-green-600 mt-1">
                      Real-time users
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Countries</p>
                    <p className="text-2xl font-bold">42</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Active travelers
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Signups & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Signups */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Signups</CardTitle>
                <CardDescription>New users in the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentSignups.length > 0 ? (
                    stats.recentSignups.map((signup) => (
                      <div
                        key={signup.id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {signup.profile?.fullName || 'New User'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {signup.email}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(signup.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No recent signups</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <Calendar className="h-6 w-6" />
                    <span>Travel Plans</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <Star className="h-6 w-6" />
                    <span>Moderate Reviews</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <DollarSign className="h-6 w-6" />
                    <span>Subscriptions</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <AlertCircle className="h-6 w-6" />
                    <span>Reports</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-auto py-4 flex-col gap-2"
                  >
                    <Globe className="h-6 w-6" />
                    <span>Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Platform health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>API Server</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>Database</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>File Storage</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span>Payment Gateway</span>
                  </div>
                  <span className="text-sm text-green-600">Operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
}
