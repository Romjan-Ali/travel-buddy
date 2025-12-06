// frontend/app/payments/page.tsx
'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { SubscriptionPlans } from '@/components/payments/subscription-plans'
import {
  CreditCard,
  CheckCircle,
  History,
  Download,
  AlertCircle,
  Shield,
  Zap,
} from 'lucide-react'

export default function PaymentsPage() {
  useProtectedRoute()
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    setIsLoading(true)
    try {
      const result = await paymentAPI.getSubscription()
      setSubscription(result.data?.subscription || null)
    } catch (error) {
      toast.error('Failed to load subscription details')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of the billing period.'
      )
    ) {
      return
    }

    setIsCancelling(true)
    try {
      await paymentAPI.cancelSubscription()
      toast.success(
        'Subscription will be canceled at the end of the billing period'
      )
      fetchSubscription()
    } catch (error) {
      toast.error('Failed to cancel subscription')
    } finally {
      setIsCancelling(false)
    }
  }

  const getSubscriptionStatus = () => {
    if (!subscription) return { label: 'Free', variant: 'secondary' as const }

    switch (subscription.status) {
      case 'active':
        return { label: 'Active', variant: 'default' as const }
      case 'past_due':
        return { label: 'Past Due', variant: 'destructive' as const }
      case 'canceled':
        return { label: 'Canceled', variant: 'outline' as const }
      default:
        return { label: subscription.status, variant: 'outline' as const }
    }
  }

  const status = getSubscriptionStatus()

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Subscription & Payments</h1>
        <p className="text-muted-foreground">
          Upgrade your account and manage your subscription
        </p>
      </div>

      {/* Current Subscription */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : subscription ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-xl font-bold">Premium Subscription</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Billing Period
                  </p>
                  <p className="text-xl font-bold">Monthly</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Next Billing Date
                  </p>
                  <p className="text-xl font-bold">
                    {subscription.stripeData?.currentPeriodEnd
                      ? new Date(
                          subscription.stripeData.currentPeriodEnd
                        ).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Premium Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-primary" />
                      Verified Traveler Badge
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      Unlimited Travel Plans
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      Priority Support
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary" />
                      Advanced Search Filters
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Billing History
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download your invoices and payment receipts
                  </p>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Invoices
                  </Button>
                </div>
              </div>

              {subscription.stripeData?.cancelAtPeriodEnd ? (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
                        Subscription Ending
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Your subscription will be canceled on{' '}
                        {new Date(
                          subscription.stripeData.currentPeriodEnd
                        ).toLocaleDateString()}
                        . You&apos;ll lose access to premium features after this
                        date.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <CreditCard className="h-4 w-4" />
                    Update Payment Method
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={handleCancelSubscription}
                    disabled={isCancelling}
                  >
                    {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                No Active Subscription
              </h3>
              <p className="text-muted-foreground mb-4">
                You&apos;re currently on the free plan. Upgrade to unlock
                premium features.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Plan</CardTitle>
          <CardDescription>
            Select the perfect plan for your travel needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionPlans
            currentPlan={
              subscription
                ? subscription.stripeData.priceId ===
                  'price_1SaHXbLaGyGdTIttfCY7mwaP'
                  ? 'premium'
                  : subscription.stripeData.priceId ===
                    'price_1SaI29LaGyGdTItteNpIsNMc'
                  ? 'yearly'
                  : 'free'
                : 'free'
            }
          />

          <div className="mt-8 p-6 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Secure Payment & Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <p className="font-medium mb-1">SSL Secure Payment</p>
                <p className="text-muted-foreground">
                  All payments are encrypted and secure
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">30-Day Money Back</p>
                <p className="text-muted-foreground">
                  Not satisfied? Get a full refund within 30 days
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Cancel Anytime</p>
                <p className="text-muted-foreground">
                  No long-term contracts, cancel whenever you want
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
