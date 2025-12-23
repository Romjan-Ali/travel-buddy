import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Users,
  Star,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const TopRatedTravelers = () => {
  return (
    <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top-Rated Travelers</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Meet our community&apos;s most trusted and experienced travelers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                name: 'Alex Johnson',
                location: 'New York, USA',
                rating: 4.9,
                trips: 12,
                image: 'https://randomuser.me/api/portraits/men/10.jpg',
              },
              {
                name: 'Maria Garcia',
                location: 'Madrid, Spain',
                rating: 4.8,
                trips: 8,
                image: 'https://randomuser.me/api/portraits/women/26.jpg',
              },
              {
                name: 'David Chen',
                location: 'Singapore',
                rating: 4.9,
                trips: 15,
                image: 'https://randomuser.me/api/portraits/men/80.jpg',
              },
              {
                name: 'Sarah Miller',
                location: 'London, UK',
                rating: 4.7,
                trips: 10,
                image: 'https://randomuser.me/api/portraits/women/0.jpg',
              },
            ].map((traveler, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage
                      src={traveler.image}
                      alt={traveler.name}
                      width={400}
                      height={400}
                    />
                    <AvatarFallback className="text-lg">
                      {traveler.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">
                    {traveler.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {traveler.location}
                  </p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(traveler.rating)
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">
                      {traveler.rating}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {traveler.trips} trips together
                  </p>
                  <Button size="sm" className="mt-4">
                    <Users className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
  )
}

export default TopRatedTravelers