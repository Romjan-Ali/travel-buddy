import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ShieldCheck, AlertTriangle, MapPin, Users } from 'lucide-react'

export default function SafetyTipsSection() {
  const tips = [
    {
      icon: (
        <ShieldCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      ),
      title: 'Travel Insurance',
      description:
        'Always have valid travel insurance to cover emergencies and unexpected situations.',
    },
    {
      icon: (
        <AlertTriangle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
      ),
      title: 'Stay Alert',
      description:
        'Be aware of your surroundings and keep your belongings secure while traveling.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />,
      title: 'Plan Routes',
      description:
        'Research destinations and plan your routes in advance to avoid unsafe areas.',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: 'Travel in Groups',
      description:
        'Whenever possible, travel with companions for increased safety and support.',
    },
  ]

  return (
    <section className="py-16 bg-linear-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">
          Travel Safety Tips
        </h2>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Follow these essential tips to stay safe and make your travel
          experience worry-free.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto px-4">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex items-center space-x-4">
              {tip.icon}
              <CardTitle className="text-lg font-semibold">
                {tip.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              {tip.description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
