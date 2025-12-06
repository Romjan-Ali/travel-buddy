// frontend/components/profile/ProfileAboutTab.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Globe, Calendar, Users } from 'lucide-react'

interface ProfileAboutTabProps {
  profileUser: {
    profile?: {
      visitedCountries?: string[]
    }
    travelPlans?: Array<{
      id: string
      destination: string
      startDate: string
      endDate: string
      travelType: string
      description?: string
    }>
  }
  isOwnProfile: boolean
}

export function ProfileAboutTab({ profileUser, isOwnProfile }: ProfileAboutTabProps) {
  return (
    <div className="space-y-8">
      {/* Visited Countries */}
      {profileUser.profile?.visitedCountries &&
        profileUser.profile.visitedCountries.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Countries Visited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profileUser.profile.visitedCountries.map(
                  (country, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm py-2 px-3"
                    >
                      {country}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Upcoming Plans */}
      {profileUser.travelPlans &&
        profileUser.travelPlans.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Travel Plans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profileUser.travelPlans.slice(0, 3).map((plan) => (
                  <div key={plan.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">
                        {plan.destination}
                      </h3>
                      <Badge>{plan.travelType}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(plan.startDate)} -{' '}
                        {formatDate(plan.endDate)}
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-sm">{plan.description}</p>
                    )}
                    {!isOwnProfile && (
                      <Button size="sm" className="mt-3 gap-2">
                        <Users className="h-3 w-3" />
                        Request to Join
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}