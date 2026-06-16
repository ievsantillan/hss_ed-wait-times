import type { TFunction } from 'i18next';

import { formatDistance } from '@/lib/geo';
import type { WaitSeverity } from '@/lib/waitStatus';

export function categoryLabel(t: TFunction, category: string): string {
  if (category === 'Emergency') return t('common.categories.Emergency');
  if (category === 'Urgent Care') return t('common.categories.UrgentCare');
  return category;
}

export function formatWaitMinutesLabel(t: TFunction, minutes: number | null | undefined): string {
  if (minutes == null || Number.isNaN(minutes)) return t('common.wait.unavailable');
  return t('common.wait.minutes', {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  });
}

export function severityLabel(t: TFunction, severity: WaitSeverity): string {
  return t(`common.wait.${severity}`);
}

export function statusLabel(t: TFunction, status: string): string {
  switch (status) {
    case 'Currently closed':
      return t('common.status.closed');
    case 'Wait time unavailable':
      return t('common.status.unavailable');
    case 'Closing soon':
      return t('common.status.closingSoon');
    case 'Open':
      return t('common.status.open');
    default:
      return status;
  }
}

export function localizedDistance(t: TFunction, distanceKm: number): string {
  return t('home.away', { distance: formatDistance(distanceKm) });
}
