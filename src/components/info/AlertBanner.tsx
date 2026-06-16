import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface AlertBannerProps {
  className?: string;
}

export function AlertBanner({ className = '' }: AlertBannerProps) {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <section
      aria-label={t('content.measles.ariaLabel')}
      className={`border-l-4 border-hss-green bg-hss-navy px-4 py-4 text-white shadow-sm ${className}`}
      role="alert"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-sm leading-6 sm:text-base">
          {t('content.measles.textBeforeHotline')}
          <a
            className="font-semibold text-white underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
            href={t('content.measles.hotlineUrl')}
          >
            {t('content.measles.hotlineDisplay')}
          </a>
          {t('content.measles.textAfterHotline')}
        </p>
        <button
          aria-label={t('content.measles.dismissLabel')}
          className="self-start rounded-md border border-white/70 px-3 py-1 text-sm font-semibold text-white transition hover:bg-white hover:text-hss-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
          onClick={() => setIsVisible(false)}
          type="button"
        >
          {t('common.actions.dismiss')}
        </button>
      </div>
    </section>
  );
}
