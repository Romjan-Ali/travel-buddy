// frontend/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plane, Users, MapPin, Star, Shield, Globe, Award, Heart } from 'lucide-react'
import { HeroSection } from '@/components/home/hero-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { Testimonials } from '@/components/home/testimonials'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Popular Destinations Section */}
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
              { name: 'Tokyo, Japan', travelers: 128, image: '/destinations/tokyo.jpg' },
              { name: 'Bali, Indonesia', travelers: 95, image: '/destinations/bali.jpg' },
              { name: 'Paris, France', travelers: 142, image: '/destinations/paris.jpg' },
              { name: 'New York, USA', travelers: 78, image: '/destinations/ny.jpg' },
              { name: 'Sydney, Australia', travelers: 63, image: '/destinations/sydney.jpg' },
              { name: 'Bangkok, Thailand', travelers: 112, image: '/destinations/bangkok.jpg' },
            ].map((destination, index) => (
              <Card key={index} className="overflow-hidden card-hover">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/10 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Globe className="h-20 w-20 text-primary/30" />
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
                  <Link href={`/explore?destination=${destination.name.split(',')[0]}`}>
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

      {/* Top-Rated Travelers Section */}
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
              { name: 'Alex Johnson', location: 'New York, USA', rating: 4.9, trips: 12, image: '' },
              { name: 'Maria Garcia', location: 'Madrid, Spain', rating: 4.8, trips: 8, image: '' },
              { name: 'David Chen', location: 'Singapore', rating: 4.9, trips: 15, image: '' },
              { name: 'Sarah Miller', location: 'London, UK', rating: 4.7, trips: 10, image: '' },
            ].map((traveler, index) => (
              <Card key={index} className="text-center card-hover">
                <CardContent className="pt-6">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarFallback className="text-lg">
                      {traveler.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg mb-1">{traveler.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{traveler.location}</p>
                  <div className="flex items-center justify-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(traveler.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm font-medium ml-1">{traveler.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{traveler.trips} trips together</p>
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

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TravelBuddy?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We&apos;re committed to making your travels safer, more social, and unforgettable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Verified Profiles</h3>
                <p className="text-muted-foreground">
                  All users undergo verification to ensure a safe and trustworthy community.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Smart Matching</h3>
                <p className="text-muted-foreground">
                  Our algorithm finds perfect travel companions based on interests and travel style.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Review System</h3>
                <p className="text-muted-foreground">
                  Rate and review your travel experiences to help others make informed decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-16 gradient-bg text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of travelers who have found their perfect travel companions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                <Plane className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                <Users className="mr-2 h-5 w-5" />
                Explore Travelers
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm opacity-80">
            No credit card required • Free plan available
          </p>
        </div>
      </section>
    </div>
  )
}