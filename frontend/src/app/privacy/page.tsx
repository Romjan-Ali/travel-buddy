export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your privacy is important to us. This policy explains how we handle
          your information.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">
            1. Information We Collect
          </h2>
          <p className="text-muted-foreground">
            We may collect personal information such as your name, email
            address, and any details you provide when contacting us or using
            our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground">
            The information we collect is used to provide and improve our
            services, respond to inquiries, send important updates, and ensure
            a safe user experience.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            3. Data Sharing and Disclosure
          </h2>
          <p className="text-muted-foreground">
            We do not sell, trade, or rent your personal information. Your data
            may be shared only when required by law or to protect our legal
            rights.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            4. Cookies and Tracking
          </h2>
          <p className="text-muted-foreground">
            We may use cookies and similar technologies to enhance your
            browsing experience and analyze site usage. You can disable
            cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. Data Security
          </h2>
          <p className="text-muted-foreground">
            We take reasonable measures to protect your personal information
            from unauthorized access, misuse, or disclosure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Third-Party Services
          </h2>
          <p className="text-muted-foreground">
            Our website may contain links to third-party services. We are not
            responsible for the privacy practices of those external sites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated effective date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Contact Us
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact
            us through the contact page.
          </p>
        </section>

        <p className="pt-6 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
