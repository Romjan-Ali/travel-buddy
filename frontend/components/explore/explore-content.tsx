// frontend/components/explore/explore-content.tsx
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { travelPlanAPI, matchAPI } from "@/lib/api"
import { toast } from "sonner"
import { MapPin, Calendar, Send, UserPlus, CheckCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Match, TravelPlan } from "@/types"

interface MatchRequestDialogProps {
  travelPlan: TravelPlan
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function MatchRequestDialog({ travelPlan, isOpen, onOpenChange, onSuccess }: MatchRequestDialogProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to send match requests")
      return
    }

    if (!travelPlan.user.id) {
      toast.error("Travel user ID in travel plan is missing")
      return
    }

    setIsLoading(true)
    try {
      await matchAPI.create({
        receiverId: travelPlan.user.id,
        travelPlanId: travelPlan.id,
        message: message || `I'd like to join your trip to ${travelPlan.destination}`,
      })

      toast.success("Match request sent successfully!")
      onSuccess()
      onOpenChange(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("Failed to send match request")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getDefaultMessage = () => {
    return `Hi ${travelPlan.user?.profile?.fullName || "there"}! I'm interested in joining your trip to ${
      travelPlan.destination
    } from ${formatDate(travelPlan.startDate)} to ${formatDate(travelPlan.endDate)}. Looking forward to connecting!`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Request to Join
          </DialogTitle>
          <DialogDescription>
            Send a match request to {travelPlan.user?.profile?.fullName || "this traveler"}
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
              Introduce yourself and explain why you&apos;d be a good travel companion
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !user} className="gap-2">
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

export default function ExploreContent() {
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    destination: searchParams.get("destination") || "",
    travelType: searchParams.get("travelType") || "",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sentRequestPlanIds, setSentRequestPlanIds] = useState<Set<string>>(new Set())
  const [sentMatchRequests, setSentMatchRequests] = useState<Match[]>([])

  useEffect(() => {
    fetchTravelPlans()
  }, [filters, page])

  useEffect(() => {
    // Load sent match requests from API
    const fetchMatchRequests = async () => {
      try {
        const sentMatchRequestsData = await matchAPI.getMyMatches({
          type: "sent",
          page: 1,
          limit: 20,
        })

        const sentMatchRequestsPlanIds =
          sentMatchRequestsData.data.matches
            .map((v: Match) => v.travelPlanId)
            .filter((id): id is string => Boolean(id)) || []

        setSentRequestPlanIds(new Set(sentMatchRequestsPlanIds))
        setSentMatchRequests(sentMatchRequestsData.data.matches || [])
      } catch (error) {
        console.error("Failed to fetch match requests:", error)
      }
    }

    fetchMatchRequests()
  }, [])

  const fetchTravelPlans = async () => {
    setIsLoading(true)
    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, value]) => value !== ""))

      const result = await travelPlanAPI.search(activeFilters, page, 9)
      setTravelPlans(result.data?.plans || [])
      setTotalPages(result.data?.pagination?.pages || 1)
    } catch (error) {
      toast.error("Failed to load travel plans")
      console.error("Explore error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchTravelPlans()
  }

  const handleReset = () => {
    setFilters({
      destination: "",
      travelType: "",
      startDate: "",
      endDate: "",
    })
    setPage(1)
  }

  const handleRequestClick = (plan: TravelPlan) => {
    if (!user) {
      toast.error("Please login to send match requests")
      return
    }

    // Check if user is viewing their own plan
    if (user.id === plan.user?.id) {
      toast.error("You cannot send a match request to your own travel plan")
      return
    }

    setSelectedPlan(plan)
    setIsDialogOpen(true)
  }

  const handleMatchSuccess = async () => {
    if (selectedPlan) {
      // Refresh match requests to get updated status
      try {
        const sentMatchRequestsData = await matchAPI.getMyMatches({
          type: "sent",
          page: 1,
          limit: 20,
        })

        const sentMatchRequestsPlanIds =
          sentMatchRequestsData.data.matches
            .map((v: Match) => v.travelPlanId)
            .filter((id): id is string => Boolean(id)) || []

        setSentRequestPlanIds(new Set(sentMatchRequestsPlanIds))
        setSentMatchRequests(sentMatchRequestsData.data.matches || [])
      } catch (error) {
        console.error("Failed to refresh match requests:", error)
      }

      // Refresh travel plans
      fetchTravelPlans()
    }
  }

  const getMatchStatus = (planId: string): "PENDING" | "ACCEPTED" | "REJECTED" | null => {
    const match = sentMatchRequests.find((match) => match.travelPlanId === planId)
    return match?.status || null
  }

  const travelTypes = ["SOLO", "FAMILY", "FRIENDS", "COUPLE", "BUSINESS"]

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Travel Buddy</h1>
        <p className="text-muted-foreground">Discover travelers with similar plans and interests</p>
      </div>
    </div>
  )
}
