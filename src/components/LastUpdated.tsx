import { useTranslation } from 'react-i18next';

import { formatUpdatedAtForLocale } from '@/i18n/format';

export function LastUpdated({
  fetchedAt,
  stale,
}: {
  fetchedAt: Date | null;
  stale?: boolean;
}) {
  const { i18n, t } = useTranslation();
  if (!fetchedAt) return null;
  return (
    <p className="flex flex-col gap-1 text-sm text-hss-gray sm:flex-row sm:flex-wrap sm:items-center" aria-live="polite">
      <span>
        {t('lastUpdated.label')}{' '}
        <span className="font-medium text-hss-navy">
          {formatUpdatedAtForLocale(fetchedAt, i18n.resolvedLanguage || i18n.language)}
        </span>
      </span>
      <span>{t('lastUpdated.frequency')}</span>
      {stale && <span className="font-medium text-amber-700">{t('lastUpdated.stale')}</span>}
    </p>
  );
}
