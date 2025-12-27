export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">
          Please read these terms carefully before using our services.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-semibold">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing or using this website, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">2. Use of the Service</h2>
          <p className="text-muted-foreground">
            You agree to use the service only for lawful purposes and in a way
            that does not infringe the rights of others or restrict their use of
            the service.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">3. User Accounts</h2>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your
            account information and for all activities that occur under your
            account.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            4. Intellectual Property
          </h2>
          <p className="text-muted-foreground">
            All content, features, and functionality on this site are owned by
            us and are protected by intellectual property laws. You may not
            reproduce or distribute any content without permission.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">5. Termination</h2>
          <p className="text-muted-foreground">
            We reserve the right to suspend or terminate your access to the
            service at any time, without notice, if you violate these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">6. Disclaimer</h2>
          <p className="text-muted-foreground">
            The service is provided “as is” without warranties of any kind. We
            do not guarantee that the service will be uninterrupted or
            error-free.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            7. Limitation of Liability
          </h2>
          <p className="text-muted-foreground">
            We shall not be liable for any damages arising from your use of the
            service, including but not limited to direct, indirect, or
            incidental damages.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">8. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We may update these Terms of Service at any time. Continued use of
            the service after changes are posted constitutes acceptance of the
            revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">9. Governing Law</h2>
          <p className="text-muted-foreground">
            These terms are governed by and interpreted in accordance with the
            laws applicable in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            10. Contact Information
          </h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please
            contact us via the contact page.
          </p>
        </section>

        <p className="pt-6 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
