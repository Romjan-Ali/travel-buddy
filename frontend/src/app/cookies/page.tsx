export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Cookie Policy</h1>
        <p className="mt-2 text-muted-foreground">
          This policy explains how we use cookies and similar technologies.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-semibold">1. What Are Cookies?</h2>
          <p className="text-muted-foreground">
            Cookies are small text files stored on your device when you visit a
            website. They help improve user experience by remembering
            preferences and understanding how the site is used.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">2. How We Use Cookies</h2>
          <p className="text-muted-foreground">
            We use cookies to ensure the website functions properly, remember
            your preferences, analyze traffic, and improve our services.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            3. Types of Cookies We Use
          </h2>
          <p className="text-muted-foreground">
            We may use essential cookies, performance cookies, and functionality
            cookies. Essential cookies are required for basic site
            functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">4. Third-Party Cookies</h2>
          <p className="text-muted-foreground">
            Some cookies may be set by third-party services such as analytics or
            embedded content. We do not control these cookies.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">5. Managing Cookies</h2>
          <p className="text-muted-foreground">
            You can control or disable cookies through your browser settings.
            Please note that disabling cookies may affect website functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            6. Changes to This Policy
          </h2>
          <p className="text-muted-foreground">
            We may update this Cookie Policy from time to time. Any changes will
            be posted on this page.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">7. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Cookie Policy, please contact
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
