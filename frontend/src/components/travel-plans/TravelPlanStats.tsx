// frontend/app/travel-plans/[id]/components/TravelPlanStats.tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Calendar, DollarSign, Users, Clock, CheckCircle } from 'lucide-react'
import { calculateDaysBetween } from '@/lib/utils'

interface TravelPlanStatsProps {
  startDate: string | Date
  endDate: string | Date
  budget: string
  matchesCount: number
  isUpcoming: boolean
}

export function TravelPlanStats({
  startDate,
  endDate,
  budget,
  matchesCount,
  isUpcoming
}: TravelPlanStatsProps) {
  const daysBetween = calculateDaysBetween(new Date(startDate), new Date(endDate))

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="text-xl font-bold">{daysBetween} days</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-xl font-bold">{budget}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Matches</p>
              <p className="text-xl font-bold">{matchesCount}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-xl font-bold">{isUpcoming ? 'Active' : 'Completed'}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              {isUpcoming ? (
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}