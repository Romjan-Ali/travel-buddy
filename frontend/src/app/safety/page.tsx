import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ShieldCheck, AlertTriangle, MapPin, PhoneCall } from "lucide-react"

const safetyTips = [
  {
    title: "Share Your Trip Details",
    description:
      "Always share your travel plan, hotel details, and contact number with a trusted person.",
    icon: ShieldCheck,
  },
  {
    title: "Stay Alert in Public Places",
    description:
      "Keep an eye on your belongings and avoid using your phone carelessly in crowded areas.",
    icon: AlertTriangle,
  },
  {
    title: "Know Local Emergency Info",
    description:
      "Save local emergency numbers and know the nearest hospital or police station.",
    icon: PhoneCall,
  },
  {
    title: "Use Verified Transport",
    description:
      "Prefer trusted transport services and avoid traveling alone late at night.",
    icon: MapPin,
  },
]

export default function SafetyTipsPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Travel Safety Tips
        </h1>
        <p className="mt-2 text-muted-foreground">
          Simple guidelines to keep you safe during your journey
        </p>
      </div>

      {/* Tips Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {safetyTips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <Card
              key={index}
              className="transition-shadow hover:shadow-lg"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-base">
                  {tip.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <CardDescription>
                  {tip.description}
                </CardDescription>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
