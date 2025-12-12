// frontend/app/travel-plans/[id]/components/TravelPlanHeader.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Edit,
  Trash2,
  Share2,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  LoaderCircle,
} from 'lucide-react'
import { formatDate, calculateDaysBetween } from '@/lib/utils'

interface TravelPlanHeaderProps {
  destination: string
  startDate: string | Date
  endDate: string | Date
  travelType: string
  isPlanOwner: boolean
  userMatchStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED' | null
  isUpcoming: boolean
  joinRequestLoading: boolean
  onEdit: () => void
  onDelete: () => void
  onShare: () => void
  onRequestToJoin: () => void
}

export function TravelPlanHeader({
  destination,
  startDate,
  endDate,
  travelType,
  isPlanOwner,
  userMatchStatus,
  isUpcoming,
  joinRequestLoading,
  onEdit,
  onDelete,
  onShare,
  onRequestToJoin,
}: TravelPlanHeaderProps) {
  const daysBetween = calculateDaysBetween(
    new Date(startDate),
    new Date(endDate)
  )

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{destination}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
              <span className="text-sm">({daysBetween} days)</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                {isUpcoming ? 'Upcoming' : 'Completed'}
              </Badge>
              <Badge variant="outline">{travelType}</Badge>
              {/* User match status badge */}
              {!isPlanOwner && userMatchStatus === 'PENDING' && (
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-700 border-yellow-200"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  Request Pending
                </Badge>
              )}
              {!isPlanOwner && userMatchStatus === 'ACCEPTED' && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Request Accepted
                </Badge>
              )}
              {!isPlanOwner && userMatchStatus === 'REJECTED' && (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  <XCircle className="h-3 w-3 mr-1" />
                  Request Declined
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {isPlanOwner ? (
            <>
              <Button variant="outline" onClick={onEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={onDelete}
                className="gap-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={onShare} className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={onRequestToJoin}
                className="gap-2"
                disabled={
                  !isUpcoming ||
                  userMatchStatus === 'PENDING' ||
                  userMatchStatus === 'ACCEPTED' ||
                  joinRequestLoading
                }
              >
                {joinRequestLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                {userMatchStatus === 'PENDING'
                  ? 'Request Pending'
                  : userMatchStatus === 'ACCEPTED'
                  ? 'Request Accepted'
                  : userMatchStatus === 'REJECTED'
                  ? 'Request to Join'
                  : 'Request to Join'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
