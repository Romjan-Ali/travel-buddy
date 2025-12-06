// frontend/app/matches/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { matchAPI } from '@/lib/api'
import { toast } from 'sonner'
import { MatchRequest } from '@/components/matches/match-request'
import { Users, Inbox, Send, Check, Clock } from 'lucide-react'
import { Match } from '@/types'

export default function MatchesPage() {
  useProtectedRoute()
  const [activeTab, setActiveTab] = useState('received')
  const [receivedMatches, setReceivedMatches] = useState<Match[]>([])
  const [sentMatches, setSentMatches] = useState<Match[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchMatches()
  }, [activeTab])

  const fetchMatches = async () => {
    setIsLoading(true)
    try {
      if (activeTab === 'received' || activeTab === 'all') {
        const receivedData = await matchAPI.getMyMatches({type: 'received'})
        console.log({receivedData})
        setReceivedMatches(receivedData.data.matches || [])
      }
      if (activeTab === 'sent' || activeTab === 'all') {
        const sentData = await matchAPI.getMyMatches({type: 'sent'})
        setSentMatches(sentData.data.matches || [])
      }
    } catch (error) {
      toast.error('Failed to load matches')
      console.error('Matches error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const pendingReceived = receivedMatches.filter(m => m.status === 'PENDING')
  const acceptedMatches = [...receivedMatches, ...sentMatches].filter(m => m.status === 'ACCEPTED')

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Match Requests</h1>
        <p className="text-muted-foreground">
          Manage your travel companion requests and connections
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingReceived.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{acceptedMatches.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Received</p>
                <p className="text-2xl font-bold">{receivedMatches.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Inbox className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold">{sentMatches.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Send className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="received" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="received" className="gap-2">
            <Inbox className="h-4 w-4" />
            Received ({pendingReceived.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="h-4 w-4" />
            Sent
          </TabsTrigger>
          <TabsTrigger value="accepted" className="gap-2">
            <Check className="h-4 w-4" />
            Accepted ({acceptedMatches.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received">
          <Card>
            <CardHeader>
              <CardTitle>Received Match Requests</CardTitle>
              <CardDescription>
                Travelers who want to join your adventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading matches...</p>
                </div>
              ) : pendingReceived.length > 0 ? (
                <div className="space-y-4">
                  {pendingReceived.map((match) => (
                    <MatchRequest
                      key={match.id}
                      match={match}
                      type="received"
                      onUpdate={fetchMatches}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Inbox className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No pending requests</h3>
                  <p className="text-muted-foreground mb-4">
                    You don&apos;t have any pending match requests
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Find Travel Buddies
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent">
          <Card>
            <CardHeader>
              <CardTitle>Sent Match Requests</CardTitle>
              <CardDescription>
                Requests you&apos;ve sent to other travelers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading matches...</p>
                </div>
              ) : sentMatches.length > 0 ? (
                <div className="space-y-4">
                  {sentMatches.map((match) => (
                    <MatchRequest
                      key={match.id}
                      match={match}
                      type="sent"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No sent requests</h3>
                  <p className="text-muted-foreground">
                    You haven&apos;t sent any match requests yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle>Accepted Matches</CardTitle>
              <CardDescription>
                Travel companions you&apos;ve connected with
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Loading matches...</p>
                </div>
              ) : acceptedMatches.length > 0 ? (
                <div className="space-y-4">
                  {acceptedMatches.map((match) => (
                    <MatchRequest
                      key={match.id}
                      match={match}
                      type="received"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No accepted matches</h3>
                  <p className="text-muted-foreground mb-4">
                    Start connecting with travelers to see accepted matches here
                  </p>
                  <Button>
                    <Users className="mr-2 h-4 w-4" />
                    Explore Travelers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}