import Link from 'next/link'
import Image from 'next/image'
import {
  MapPin,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const PopularDestination = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Popular Destinations</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover where fellow travelers are heading next
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Tokyo, Japan',
              travelers: 128,
              image: '/images/home-page/destinations/tokyo-japan.jpeg',
            },
            {
              name: 'Bali, Indonesia',
              travelers: 95,
              image: '/images/home-page/destinations/bali-indonesia.jpg',
            },
            {
              name: 'Paris, France',
              travelers: 142,
              image: '/images/home-page/destinations/paris-france.jpg',
            },
            {
              name: 'New York, USA',
              travelers: 78,
              image: '/images/home-page/destinations/new-york-usa.jpg',
            },
            {
              name: 'Sydney, Australia',
              travelers: 63,
              image: '/images/home-page/destinations/sydney-australia.jpg',
            },
            {
              name: 'Bangkok, Thailand',
              travelers: 112,
              image: '/images/home-page/destinations/bangkok-thailand.jpg',
            },
          ].map((destination, index) => (
            <Card key={index} className="overflow-hidden card-hover">
              <div className="h-48 bg-linear-to-br from-primary/20 to-primary/10 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    className="object-cover h-48 w-full"
                    src={destination.image}
                    width={1000}
                    height={400}
                    alt={destination.name}
                  />
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{destination.name}</span>
                  <span className="text-sm font-normal px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {destination.travelers} travelers
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/explore?destination=${
                    destination.name.split(',')[0]
                  }`}
                >
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Find Travel Buddies
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PopularDestination
