// frontend/components/reviews/ReviewTips.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export function ReviewTips() {
  const tips = [
    {
      number: 1,
      title: "Be Specific",
      description: "Mention specific activities, communication, or moments that stood out.",
      color: "blue"
    },
    {
      number: 2,
      title: "Be Constructive",
      description: "Provide feedback that can help others improve their travel experience.",
      color: "green"
    },
    {
      number: 3,
      title: "Be Honest",
      description: "Share your genuine experience to help build trust in the community.",
      color: "yellow"
    },
    {
      number: 4,
      title: "Be Timely",
      description: "Leave reviews while the experience is fresh in your mind.",
      color: "purple"
    }
  ]

  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Tips for Writing Great Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tips.map((tip) => (
            <div key={tip.number} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`h-6 w-6 rounded-full ${colorClasses[tip.color as keyof typeof colorClasses]} flex items-center justify-center`}>
                  <span className="text-sm font-bold">{tip.number}</span>
                </div>
                <h4 className="font-semibold">{tip.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}