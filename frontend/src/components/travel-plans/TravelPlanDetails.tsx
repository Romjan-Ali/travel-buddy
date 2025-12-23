// frontend/components/travel-plans/TravelPlanDetails.tsx
// frontend/app/travel-plans/[id]/components/TravelPlanDetails.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Users,
  Share2,
  MessageSquare,
  Heart,
  UserPlus,
} from 'lucide-react'
import { formatDate, calculateDaysBetween } from '@/lib/utils'
import { Review, TravelPlan } from '@/types'

interface TravelPlanDetailsProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  travelPlanId: string
  onRequestToJoin: () => void
}

export function TravelPlanDetails({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  travelPlanId,
  onRequestToJoin,
}: TravelPlanDetailsProps) {
  const daysBetween = calculateDaysBetween(
    new Date(travelPlan.startDate),
    new Date(travelPlan.endDate)
  )

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Trip Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About This Trip</h3>
            <p className="text-muted-foreground">
              {travelPlan.description || 'No description provided.'}
            </p>
          </div>

          <Separator />

          {/* Trip Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Trip Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{travelPlan.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Dates</p>
                    <p className="font-medium">
                      {formatDate(travelPlan.startDate)} -{' '}
                      {formatDate(travelPlan.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Travel Type</p>
                    <p className="font-medium">{travelPlan.travelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{travelPlan.budget}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Quick Facts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Trip Duration</p>
                  <p className="text-xl font-bold">{daysBetween} days</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-xl font-bold">
                    {isUpcoming ? 'Planning Phase' : 'Completed'}
                  </p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Visibility</p>
                  <p className="text-xl font-bold">
                    {travelPlan.isPublic ? 'Public' : 'Private'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isPlanOwner ? (
              <>
                <Link href={`/travel-plans/${travelPlanId}/matches`}>
                  <Button className="gap-2">
                    <Users className="h-4 w-4" />
                    View Match Requests
                  </Button>
                </Link>
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Plan
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onRequestToJoin}
                  className="gap-2"
                  disabled={
                    !isUpcoming ||
                    userMatchStatus === 'PENDING' ||
                    userMatchStatus === 'ACCEPTED'
                  }
                >
                  <UserPlus className="h-4 w-4" />
                  {userMatchStatus === 'PENDING'
                    ? 'Request Pending'
                    : userMatchStatus === 'ACCEPTED'
                    ? 'Request Accepted'
                    : userMatchStatus === 'REJECTED'
                    ? 'Request to Join'
                    : 'Request to Join'}
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Message Organizer
                </Button>
                <Button variant="outline" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Save Plan
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Trip Photos Card */}
      {travelPlan.tripPhotos && travelPlan.tripPhotos.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Trip Photos</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {travelPlan.tripPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.url}
                alt={`Trip Photo ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </CardContent>
        </Card>
      )}
    </>
  )
}
