// frontend/components/home/how-it-works.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserPlus, Calendar, Users, Star } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create Your Profile',
      description:
        'Sign up and create your travel profile with interests, photos, and travel preferences.',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    },
    {
      icon: Calendar,
      title: 'Plan Your Trip',
      description:
        'Create or join travel plans with dates, destinations, and budget preferences.',
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    },
    {
      icon: Users,
      title: 'Find Matches',
      description:
        'Our smart algorithm matches you with compatible travelers heading to the same destinations.',
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
    },
    {
      icon: Star,
      title: 'Travel & Review',
      description:
        'Meet up, travel together, and leave reviews to build your travel reputation.',
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    },
  ]

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From finding travel buddies to creating unforgettable memories -
            it&apos;s simple with TravelBuddy
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative card-hover">
              <div className="absolute -top-4 left-6">
                <div
                  className={`h-12 w-12 rounded-lg ${step.color} flex items-center justify-center`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
              </div>
              <CardHeader className="pt-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </div>
                <CardDescription className="text-base">
                  {step.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            Average time to find a match:{' '}
            <span className="font-bold ml-1">24 hours</span>
          </div>
        </div>
      </div>
    </section>
  )
}
