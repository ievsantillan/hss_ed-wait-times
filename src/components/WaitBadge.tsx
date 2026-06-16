import { formatWaitMinutes } from '@/lib/ahsTransform';
import { facilityStatus, waitSeverity } from '@/lib/waitStatus';
import type { MergedFacility } from '@/lib/merge';

const SEVERITY_CLASS: Record<string, string> = {
  short: 'bg-hss-green/15 text-hss-navy ring-hss-green/40',
  medium: 'bg-amber-100 text-amber-900 ring-amber-300',
  long: 'bg-red-100 text-red-900 ring-red-300',
  unknown: 'bg-gray-100 text-hss-gray ring-gray-300',
};

/** Coloured wait-time pill with an accessible label, or a status note when unavailable. */
export function WaitBadge({ facility }: { facility: MergedFacility }) {
  const status = facilityStatus(facility);
  if (status.unavailable) {
    return (
      <span
        className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-hss-gray ring-1 ring-gray-300"
        role="status"
      >
        {status.label}
      </span>
    );
  }
  const severity = waitSeverity(facility.waitMinutes);
  const text = formatWaitMinutes(facility.waitMinutes);
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ${SEVERITY_CLASS[severity]}`}
      aria-label={`Estimated wait ${text}`}
    >
      {text}
    </span>
  );
}
