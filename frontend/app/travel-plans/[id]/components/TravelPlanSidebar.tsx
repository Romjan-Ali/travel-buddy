// frontend/app/travel-plans/[id]/components/TravelPlanSidebar.tsx
'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TravelPlanTimeline } from './TravelPlanTimeline'
import { QuickActions } from './QuickActions'
import { Share2 } from 'lucide-react'

interface TravelPlanSidebarProps {
  travelPlan: any
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  onShare: () => void
  onRequestToJoin: () => void
}

export function TravelPlanSidebar({
  travelPlan,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  onShare,
  onRequestToJoin
}: TravelPlanSidebarProps) {
  return (
    <div>
      <QuickActions
        isPlanOwner={isPlanOwner}
        userMatchStatus={userMatchStatus}
        isUpcoming={isUpcoming}
        travelPlanId={travelPlan.id}
        onRequestToJoin={onRequestToJoin}
      />

      <TravelPlanTimeline
        destination={travelPlan.destination}
        startDate={travelPlan.startDate}
        endDate={travelPlan.endDate}
        isUpcoming={isUpcoming}
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Share This Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <span className="text-blue-500">f</span>
              Facebook
            </Button>
            <Button variant="outline" className="gap-2">
              <span className="text-blue-400">t</span>
              Twitter
            </Button>
            <Button variant="outline" className="gap-2">
              <span className="text-red-500">in</span>
              LinkedIn
            </Button>
            <Button variant="outline" onClick={onShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              Copy Link
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}