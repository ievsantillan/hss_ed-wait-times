import { useTranslation } from 'react-i18next';

export function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <main className="mx-auto max-w-3xl space-y-8 rounded-xl bg-white p-6 text-hss-gray shadow-sm ring-1 ring-gray-200 sm:p-8">
      <header className="space-y-3 border-b border-gray-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-hss-green">{t('privacy.eyebrow')}</p>
        <h1 className="text-3xl font-bold text-hss-navy">{t('privacy.title')}</h1>
        <p className="text-base leading-7">{t('privacy.intro')}</p>
      </header>

      <section aria-labelledby="privacy-data-heading" className="space-y-4">
        <h2 id="privacy-data-heading" className="text-xl font-semibold text-hss-navy">
          {t('privacy.dataHeading')}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-lg bg-hss-surface p-4">
            <h3 className="font-semibold text-hss-navy">{t('privacy.geolocationHeading')}</h3>
            <p className="mt-2 text-sm leading-6">
              {t('privacy.geolocationBodyBefore')}
              <span className="font-medium text-hss-navy">{t('privacy.geolocationBodyAction')}</span>
              {t('privacy.geolocationBodyAfter')}
            </p>
          </article>
          <article className="rounded-lg bg-hss-surface p-4">
            <h3 className="font-semibold text-hss-navy">{t('privacy.favouritesHeading')}</h3>
            <p className="mt-2 text-sm leading-6">{t('privacy.favouritesBody')}</p>
          </article>
        </div>
      </section>

      <section aria-labelledby="wait-times-heading" className="space-y-3">
        <h2 id="wait-times-heading" className="text-xl font-semibold text-hss-navy">
          {t('privacy.waitInfoHeading')}
        </h2>
        <p className="leading-7">
          {t('privacy.waitInfoBodyBefore')}
          <span className="font-semibold text-hss-navy">911</span>
          {t('privacy.waitInfoBodyAfter')}
        </p>
      </section>

      <section aria-labelledby="accessibility-heading" className="space-y-3 rounded-lg bg-hss-navy p-5 text-white">
        <h2 id="accessibility-heading" className="text-xl font-semibold">{t('privacy.accessibilityHeading')}</h2>
        <p className="leading-7 text-white/90">{t('privacy.accessibilityBody')}</p>
      </section>
    </main>
  );
}
