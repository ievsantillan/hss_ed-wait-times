export function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-8 rounded-xl bg-white p-6 text-hss-gray shadow-sm ring-1 ring-gray-200 sm:p-8">
      <header className="space-y-3 border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-hss-green">Privacy and accessibility</p>
        <h1 className="text-3xl font-bold text-hss-navy">Privacy notice</h1>
        <p className="text-base leading-7">
          HSS Emergency Department Wait Times is a fully public information service. It does not use user
          accounts, authentication, advertising, or third-party analytics and tracking by default.
        </p>
      </header>

      <section aria-labelledby="privacy-data-heading" className="space-y-4">
        <h2 id="privacy-data-heading" className="text-xl font-semibold text-hss-navy">
          How this app uses data
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-lg bg-hss-surface p-4">
            <h3 className="font-semibold text-hss-navy">Geolocation</h3>
            <p className="mt-2 text-sm leading-6">
              If you tap <span className="font-medium text-hss-navy">Nearest to me</span>, your browser location is
              used only on your device to sort facilities by distance. Your location is never sent to a server or stored.
            </p>
          </article>
          <article className="rounded-lg bg-hss-surface p-4">
            <h3 className="font-semibold text-hss-navy">Favourites</h3>
            <p className="mt-2 text-sm leading-6">
              Favourite facilities are remembered with localStorage on your device only. They are not linked to an
              account and are not shared with HSS or any service.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="wait-times-heading" className="space-y-3">
        <h2 id="wait-times-heading" className="text-xl font-semibold text-hss-navy">
          Wait-time information
        </h2>
        <p className="leading-7">
          Wait-time data is provided by Alberta Health Services. It is approximate and for information only. In a
          life-threatening emergency, call <span className="font-semibold text-hss-navy">911</span> immediately.
        </p>
      </section>

      <section aria-labelledby="accessibility-heading" className="space-y-3 rounded-lg bg-hss-navy p-5 text-white">
        <h2 id="accessibility-heading" className="text-xl font-semibold">Accessibility statement</h2>
        <p className="leading-7 text-white/90">
          The app targets WCAG 2.1 AA, supports keyboard navigation, and respects reduced-motion preferences where
          motion is used.
        </p>
      </section>
    </main>
  );
}
