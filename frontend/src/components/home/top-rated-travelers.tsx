'use client'

import { useEffect, useState } from 'react'
import { Users, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'

import { userAPI } from '@/lib/api'
import Link from 'next/link'

interface TopRatedTraveler {
  id: string
  name: string
  location: string
  rating: number
  trips: number
  image: string
}

const mockData = [
  {
    id: '1',
    name: 'Alex Johnson',
    location: 'New York, USA',
    rating: 4.9,
    trips: 12,
    image: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
  {
    id: '2',
    name: 'Maria Garcia',
    location: 'Madrid, Spain',
    rating: 4.8,
    trips: 8,
    image: 'https://randomuser.me/api/portraits/women/26.jpg',
  },
  {
    id: '3',
    name: 'David Chen',
    location: 'Singapore',
    rating: 4.9,
    trips: 15,
    image: 'https://randomuser.me/api/portraits/men/80.jpg',
  },
  {
    id: '4',
    name: 'Sarah Miller',
    location: 'London, UK',
    rating: 4.7,
    trips: 10,
    image: 'https://randomuser.me/api/portraits/women/0.jpg',
  },
]

/* ---------------- Skeleton Card ---------------- */

const TravelerCardSkeleton = () => (
  <Card className="text-center">
    <CardContent className="pt-6">
      <Skeleton className="h-20 w-20 rounded-full mx-auto mb-4" />

      <Skeleton className="h-5 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-40 mx-auto mb-3" />

      <div className="flex justify-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
      </div>

      <Skeleton className="h-4 w-24 mx-auto mb-4" />

      <Skeleton className="h-8 w-32 mx-auto rounded-md" />
    </CardContent>
  </Card>
)

/* ---------------- Main Component ---------------- */

const TopRatedTravelers = () => {
  const [topRatedTravelers, setTopRatedTravelers] = useState<
    TopRatedTraveler[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await userAPI.getTopRatedTravelers()
        if(response.data.length >= 6) {
          setTopRatedTravelers(response.data)
        } else {
          setTopRatedTravelers(mockData)
        }
      } catch (error) {
        console.error('Failed to fetch top rated travelers', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

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
          {loading
            ? [...Array(4)].map((_, i) => <TravelerCardSkeleton key={i} />)
            : topRatedTravelers.map((traveler, index) => (
                <Card key={index} className="text-center card-hover">
                  <CardContent className="pt-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage
                        src={traveler.image}
                        alt={traveler.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg">
                        {traveler.name.charAt(0)}
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

                    <Button size="sm" className="mt-4" asChild>
                      <Link href={`/profile/${traveler.id}`}>
                     
                      <Users className="mr-2 h-4 w-4" />
                      View Profile
                      </Link>
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
