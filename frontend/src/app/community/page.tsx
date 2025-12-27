export default function CommunityGuidelinesPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Community Guidelines
        </h1>
        <p className="mt-2 text-muted-foreground">
          These guidelines help keep our community safe, respectful, and
          welcoming for everyone.
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 text-xl font-semibold">1. Be Respectful</h2>
          <p className="text-muted-foreground">
            Treat all members with respect. Harassment, hate speech,
            discrimination, or abusive behavior of any kind will not be
            tolerated.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            2. Keep Content Appropriate
          </h2>
          <p className="text-muted-foreground">
            Do not post offensive, explicit, or misleading content. Content
            should be relevant and appropriate for a diverse audience.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">3. No Spam or Scams</h2>
          <p className="text-muted-foreground">
            Spamming, phishing, or promoting fraudulent activities is strictly
            prohibited. Repeated violations may result in account suspension.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">4. Protect Privacy</h2>
          <p className="text-muted-foreground">
            Do not share personal or private information, including your own or
            others’. Respect everyone’s privacy at all times.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">5. Follow the Law</h2>
          <p className="text-muted-foreground">
            All activities must comply with applicable local and international
            laws. Illegal activities are not allowed on this platform.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">6. Report Violations</h2>
          <p className="text-muted-foreground">
            If you encounter behavior that violates these guidelines, please
            report it through the appropriate reporting tools or contact us.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">7. Enforcement</h2>
          <p className="text-muted-foreground">
            We reserve the right to remove content, suspend accounts, or take
            other actions if these guidelines are violated.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-semibold">
            8. Updates to Guidelines
          </h2>
          <p className="text-muted-foreground">
            These Community Guidelines may be updated from time to time.
            Continued use of the platform means you agree to the latest version.
          </p>
        </section>

        <p className="pt-6 text-xs text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
