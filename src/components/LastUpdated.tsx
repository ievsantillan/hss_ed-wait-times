import { formatUpdatedAt } from '@/lib/ahsTransform';

/** "Jun 16, 2:59 pm (updated every two minutes)" — matches the AHS last-updated line. */
export function LastUpdated({
  fetchedAt,
  stale,
}: {
  fetchedAt: Date | null;
  stale?: boolean;
}) {
  if (!fetchedAt) return null;
  return (
    <p className="text-sm text-hss-gray" aria-live="polite">
      <span className="font-medium text-hss-navy">{formatUpdatedAt(fetchedAt)}</span>{' '}
      (updated every two minutes)
      {stale && (
        <span className="ml-2 text-amber-700">· could not refresh, showing last known data</span>
      )}
    </p>
  );
}
