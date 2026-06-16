import { useTranslation } from 'react-i18next';

interface WaitTimesIntroProps {
  className?: string;
}

export function WaitTimesIntro({ className = '' }: WaitTimesIntroProps) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="wait-times-intro-heading"
      className={`rounded-xl border border-slate-200 bg-white p-5 text-hss-gray shadow-sm ${className}`}
    >
      <h2 id="wait-times-intro-heading" className="sr-only">
        {t('content.waitTimesIntro.heading')}
      </h2>
      <p className="text-base leading-7">
        {t('content.waitTimesIntro.textBeforeLink')}
        <a
          className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          href={t('content.waitTimesIntro.linkUrl')}
          rel="noopener noreferrer"
          target="_blank"
        >
          {t('content.waitTimesIntro.linkLabel')}
        </a>
        {t('content.waitTimesIntro.textAfterLink')}
      </p>
    </section>
  );
}
