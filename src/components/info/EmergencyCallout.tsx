import { useTranslation } from 'react-i18next';

interface EmergencyCalloutProps {
  className?: string;
}

export function EmergencyCallout({ className = '' }: EmergencyCalloutProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="emergency-callout-heading"
      className={`rounded-xl border border-red-200 bg-red-50 p-5 text-slate-900 shadow-sm ${className}`}
    >
      <h2 id="emergency-callout-heading" className="text-lg font-semibold text-hss-navy">
        {t('content.emergency.heading')}
      </h2>
      <p className="mt-2 text-base leading-7">
        {t('content.emergency.textBeforePhone')}
        <a
          className="font-bold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={t('content.emergency.phoneUrl')}
        >
          {t('content.emergency.phoneLabel')}
        </a>
        {t('content.emergency.textAfterPhone')}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={t('content.emergency.linkUrl')}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('content.emergency.linkLabel')}
        </a>
        {t('content.emergency.textAfterLink')}
      </p>
    </section>
  );
}
