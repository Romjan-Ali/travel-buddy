// frontend/app/travel-plans/[id]/components/MatchRequestDialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import { MapPin, Calendar, MessageSquare, CheckCircle, Send } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface MatchRequestDialogProps {
  travelPlan: any
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MatchRequestDialog({
  travelPlan,
  isOpen,
  onOpenChange,
  onSuccess
}: MatchRequestDialogProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please login to send match requests')
      return
    }

    setIsLoading(true)
    try {
      await matchAPI.create({
        receiverId: travelPlan.user.id,
        travelPlanId: travelPlan.id,
        message: message || `I'd like to join your trip to ${travelPlan.destination}`
      })
      
      toast.success('Match request sent successfully!')
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || 'Failed to send match request')
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultMessage = () => {
    return `Hi ${travelPlan.user.profile?.fullName || 'there'}! I'm interested in joining your trip to ${travelPlan.destination} from ${formatDate(travelPlan.startDate)} to ${formatDate(travelPlan.endDate)}. Looking forward to connecting!`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Request to Join
          </DialogTitle>
          <DialogDescription>
            Send a match request to {travelPlan.user.profile?.fullName || 'this traveler'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Travel Plan Summary */}
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-semibold">{travelPlan.destination}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(travelPlan.startDate)} - {formatDate(travelPlan.endDate)}
              </div>
              <Badge variant="outline" className="text-xs">
                {travelPlan.travelType}
              </Badge>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder={getDefaultMessage()}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px]"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Introduce yourself and explain why you'd be a good travel companion
            </p>
          </div>

          {/* Tips */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-sm mb-1 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Tips for a great request:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Mention shared interests from their profile</li>
              <li>• Be clear about your travel style and preferences</li>
              <li>• Suggest a time to chat before committing</li>
              <li>• Keep it friendly and respectful</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !user}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Request
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}