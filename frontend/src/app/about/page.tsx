import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">About Us</h1>
        <p className="mt-2 text-muted-foreground">
          Learn more about our mission, vision, and what drives us.
        </p>
      </div>

      {/* About Content */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              Our mission is to provide a seamless and enjoyable travel planning
              experience for everyone. We aim to empower users to organize,
              share, and explore trips effortlessly.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              We envision a world where travelers can connect, plan, and explore
              with confidence, knowing that all the tools they need are at their
              fingertips in one platform.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              Integrity, user-first design, innovation, and community engagement
              are the core values that guide everything we do.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Choose Us?</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground">
              Our platform is designed with simplicity, reliability, and
              security in mind, helping travelers save time, stay organized, and
              make their journeys memorable.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
