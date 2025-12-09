// frontend/app/travel-plans/[id]/components/TravelPlanTabs.tsx
'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TravelPlanDetails } from './TravelPlanDetails'
import { TravelPlanMatches } from './TravelPlanMatches'
import { TravelPlanOrganizer } from './TravelPlanOrganizer'
import { TravelPlanReviews } from './TravelPlanReviews'
import { TravelPlan } from '@/types'

interface TravelPlanTabsProps {
  travelPlan: TravelPlan
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  travelPlanId: string
  onRequestToJoin: () => void
}

export function TravelPlanTabs({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  travelPlanId,
  onRequestToJoin,
}: TravelPlanTabsProps) {
  return (
    <div className="lg:col-span-2">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="matches">
            Matches ({travelPlan._count?.matches || 0})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({travelPlan._count?.reviewsReceived || 0})
          </TabsTrigger>
          <TabsTrigger value="organizer">Organizer</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <TravelPlanDetails
            travelPlan={travelPlan}
            isPlanOwner={isPlanOwner}
            userMatchStatus={userMatchStatus}
            isUpcoming={isUpcoming}
            travelPlanId={travelPlanId}
            onRequestToJoin={onRequestToJoin}
          />
        </TabsContent>

        <TabsContent value="matches">
          <TravelPlanMatches
            travelPlan={travelPlan}
            travelPlanId={travelPlanId}
          />
        </TabsContent>

        <TabsContent value="reviews">
          <TravelPlanReviews
            travelPlanId={travelPlan.id}
            travelPlanDestination={travelPlan.destination}
            organizerId={travelPlan.user?.id}
            organizerName={travelPlan.user?.profile?.fullName || 'Traveler'}
            organizerImage={travelPlan.user?.profile?.profileImage ?? undefined}
          />
        </TabsContent>

        <TabsContent value="organizer">
          <TravelPlanOrganizer
            travelPlan={travelPlan}
            isPlanOwner={isPlanOwner}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
