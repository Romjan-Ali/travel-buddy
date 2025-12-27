import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-muted-foreground">
          Find answers to common questions about using our platform
        </p>
      </div>

      {/* FAQ List */}
      <div className="mx-auto max-w-3xl">
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What is Travel Buddy?
            </AccordionTrigger>
            <AccordionContent>
              Travel Buddy is a platform that helps you plan trips, manage
              itineraries, and stay connected with travel companions in real
              time.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              Is my data secure?
            </AccordionTrigger>
            <AccordionContent>
              Yes. We use secure authentication and follow best practices to
              protect your personal and travel information.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>
              Can I use Travel Buddy for free?
            </AccordionTrigger>
            <AccordionContent>
              Yes. We offer a free plan with essential features. Premium
              features may be available in the future.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>
              Can I share my trip with others?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely. You can invite friends or family to view or
              collaborate on your travel plans.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>
              How do I contact support?
            </AccordionTrigger>
            <AccordionContent>
              You can reach our support team through the contact page or by
              emailing our official support address.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
