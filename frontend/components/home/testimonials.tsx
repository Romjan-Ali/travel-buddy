// frontend/components/home/testimonials.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'New York, USA',
    image: '',
    rating: 5,
    text: 'TravelBuddy completely changed how I travel! I met Emma in Tokyo and we ended up exploring Japan together for two weeks. The matching system really works!',
    travel: 'Tokyo, Japan',
  },
  {
    name: 'David Chen',
    location: 'Singapore',
    image: '',
    rating: 5,
    text: "As a solo traveler, safety was my biggest concern. TravelBuddy's verification system gave me peace of mind. I've made friends from all over the world!",
    travel: 'Bali, Indonesia',
  },
  {
    name: 'Maria Garcia',
    location: 'Madrid, Spain',
    image: '',
    rating: 4,
    text: "The review system is fantastic. I could see other travelers' experiences before meeting up. Found the perfect hiking buddy for my Patagonia trip!",
    travel: 'Patagonia, Chile',
  },
  {
    name: 'Alex Smith',
    location: 'London, UK',
    image: '',
    rating: 5,
    text: 'I was hesitant at first, but TravelBuddy exceeded all expectations. Met three amazing people for my Southeast Asia backpacking trip. Lifelong friendships formed!',
    travel: 'Thailand & Vietnam',
  },
]

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    )
  }

  return (
    <section className="py-16 bg-linear-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Traveler Success Stories</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Hear from real travelers who found their perfect companions
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <Card className="relative overflow-hidden">
            <div className="absolute top-6 left-6 text-primary/20">
              <Quote className="h-16 w-16" />
            </div>
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="shrink-0">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">
                      {testimonials[currentIndex].name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < testimonials[currentIndex].rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-lg italic mb-6">
                    &ldquo;{testimonials[currentIndex].text}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-lg">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-muted-foreground">
                      {testimonials[currentIndex].location}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                      <Star className="h-3 w-3" />
                      Traveled to: {testimonials[currentIndex].travel}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
            <div className="text-muted-foreground">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
            <div className="text-muted-foreground">Successful Trips</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
            <div className="text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  )
}
