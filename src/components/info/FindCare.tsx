import { useTranslation } from 'react-i18next';

interface FindCareProps {
  className?: string;
}

export function FindCare({ className = '' }: FindCareProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="find-care-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="find-care-heading" className="text-lg font-semibold text-hss-navy">
        {t('content.findCare.heading')}
      </h2>
      <p className="mt-2 text-base leading-7">
        {t('content.findCare.textBeforeLink')}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={t('content.findCare.linkUrl')}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('content.findCare.linkLabel')}
        </a>
        {t('content.findCare.textAfterLink')}
      </p>
    </section>
  );
}
