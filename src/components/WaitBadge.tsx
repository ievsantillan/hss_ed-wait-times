import { useTranslation } from 'react-i18next';

import { formatWaitMinutesLabel, severityLabel, statusLabel } from '@/i18n/helpers';
import { facilityStatus, waitSeverity } from '@/lib/waitStatus';
import type { MergedFacility } from '@/lib/merge';

const SEVERITY_CLASS: Record<string, string> = {
  short: 'bg-hss-green/15 text-hss-navy ring-hss-green/40',
  medium: 'bg-amber-100 text-amber-900 ring-amber-300',
  long: 'bg-red-100 text-red-900 ring-red-300',
  unknown: 'bg-gray-100 text-hss-gray ring-gray-300',
};

export function WaitBadge({ facility }: { facility: MergedFacility }) {
  const { t } = useTranslation();
  const status = facilityStatus(facility);
  if (status.unavailable) {
    return (
      <span
        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-hss-gray ring-1 ring-gray-300"
        role="status"
      >
        {statusLabel(t, status.label)}
      </span>
    );
  }
  const severity = waitSeverity(facility.waitMinutes);
  const text = formatWaitMinutesLabel(t, facility.waitMinutes);
  const severityText = severityLabel(t, severity);
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ${SEVERITY_CLASS[severity]}`}
      aria-label={t('common.wait.estimatedAria', { time: text, severity: severityText })}
    >
      <span className="sr-only">{severityText}: </span>
      {text}
    </span>
  );
}
