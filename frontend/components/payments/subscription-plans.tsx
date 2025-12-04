'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { paymentAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Check, Star, Crown, Zap } from 'lucide-react'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Basic features for casual travelers',
    features: [
      'Create up to 3 travel plans',
      'Connect with 10 travelers per month',
      'Basic search filters',
      'Profile verification',
      'Community support'
    ],
    buttonText: 'Current Plan',
    buttonVariant: 'outline' as const,
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$9.99',
    period: 'month',
    description: 'Perfect for frequent travelers',
    features: [
      'Unlimited travel plans',
      'Unlimited connections',
      'Advanced search filters',
      'Verified badge',
      'Priority support',
      'Early access to new features',
      'Travel insights & analytics'
    ],
    buttonText: 'Upgrade to Premium',
    buttonVariant: 'default' as const,
    popular: true
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: '$99.99',
    period: 'year',
    description: 'Best value for serious travelers',
    features: [
      'Everything in Premium',
      'Save 16% vs monthly',
      'Annual travel report',
      'Exclusive travel guides',
      'Dedicated account manager',
      'Offline trip planning'
    ],
    buttonText: 'Choose Yearly',
    buttonVariant: 'default' as const,
    popular: false
  }
]

interface SubscriptionPlansProps {
  currentPlan?: string
}

export function SubscriptionPlans({ currentPlan = 'free' }: SubscriptionPlansProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    if (planId === 'free') return

    setIsLoading(planId)
    try {
      // In a real implementation, you would use Stripe price IDs
      // For now, we'll use mock price IDs
      const priceId = planId === 'premium' 
        ? 'price_1SaHXbLaGyGdTIttfCY7mwaP' 
        : 'price_1SaI29LaGyGdTItteNpIsNMc'
      
      const result = await paymentAPI.createSubscription(priceId)
      
      if (result.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.url
      }
    } catch (error) {
      toast.error('Failed to initiate subscription')
      console.error('Subscription error:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card 
          key={plan.id}
          className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-primary text-white px-3 py-1">
                <Crown className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              {plan.id === currentPlan && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Current
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">/{plan.period}</span>
            </div>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          
          <CardContent>
            <ul className="space-y-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          
          <CardFooter>
            <Button
              className="w-full gap-2"
              variant={plan.id === currentPlan ? 'outline' : plan.buttonVariant}
              onClick={() => handleSubscribe(plan.id)}
              disabled={plan.id === currentPlan || isLoading === plan.id}
            >
              {isLoading === plan.id ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  {plan.popular && <Zap className="h-4 w-4" />}
                  {plan.id === currentPlan ? plan.buttonText : plan.buttonText}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}