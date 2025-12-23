import {
  Card,
  CardContent,
} from '@/components/ui/card'
import {
  Shield,
  Award,
  Heart,
} from 'lucide-react'

const WcuSection = () => {
  return (
    <section className="py-16 bg-linear-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose TravelBuddy?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We&apos;re committed to making your travels safer, more social,
              and unforgettable
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center card-hover">
              <CardContent className="pt-6">
                <div className="h-12 w-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Verified Profiles
                </h3>
                <p className="text-muted-foreground">
                  All users undergo verification to ensure a safe and
                  trustworthy community.
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
                  Our algorithm finds perfect travel companions based on
                  interests and travel style.
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
                  Rate and review your travel experiences to help others make
                  informed decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
  )
}

export default WcuSection