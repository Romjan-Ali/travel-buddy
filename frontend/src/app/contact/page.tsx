import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contact/contact-form'

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Contact Me
        </h1>
        <p className="mt-2 text-muted-foreground">
          Have a project idea or just want to say hello? Send me a message.
        </p>
      </div>

      {/* Contact Form */}
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
          </CardHeader>

          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
