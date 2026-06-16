import { useTranslation } from 'react-i18next';

interface DisclaimerProps {
  className?: string;
}

export function Disclaimer({ className = '' }: DisclaimerProps) {
  const { t } = useTranslation();

  return (
    <footer
      aria-label={t('content.disclaimer.ariaLabel')}
      className={`border-t border-slate-200 bg-slate-50 px-4 py-6 text-sm text-hss-gray ${className}`}
    >
      <div className="mx-auto max-w-6xl space-y-3">
        <p>{t('content.disclaimer.attribution')}</p>
        <p className="leading-6">
          {t('content.disclaimer.textBeforeFeedbackLink')}
          <a
            className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hss-green"
            href={t('content.disclaimer.feedbackUrl')}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t('content.disclaimer.feedbackLabel')}
          </a>
          {t('content.disclaimer.textBeforeEmail')}
          <a
            className="font-semibold text-hss-navy underline decoration-hss-green decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-hss-green"
            href={t('content.disclaimer.emailUrl')}
          >
            {t('content.disclaimer.emailLabel')}
          </a>
          {t('content.disclaimer.textAfterEmail')}
        </p>
      </div>
    </footer>
  );
}
