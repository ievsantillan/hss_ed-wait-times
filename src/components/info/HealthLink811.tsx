import { useTranslation } from 'react-i18next';

interface HealthLink811Props {
  className?: string;
}

export function HealthLink811({ className = '' }: HealthLink811Props) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="health-link-811-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="health-link-811-heading" className="text-lg font-semibold text-hss-navy">
        {t('content.healthLink.heading')}
      </h2>
      <p className="mt-2 text-base leading-7">
        {t('content.healthLink.textBeforePhone')}
        <a
          className="font-bold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={t('content.healthLink.phoneUrl')}
        >
          {t('content.healthLink.phoneLabel')}
        </a>
        {t('content.healthLink.textAfterPhone')}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-hss-green"
          href={t('content.healthLink.linkUrl')}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('content.healthLink.linkLabel')}
        </a>
      </p>
    </section>
  );
}
