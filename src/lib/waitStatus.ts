import type { MergedFacility } from './merge';

export type WaitSeverity = 'short' | 'medium' | 'long' | 'unknown';

/** Bucket a wait time into a severity band used for the status colour hint. */
export function waitSeverity(minutes: number | null): WaitSeverity {
  if (minutes == null) return 'unknown';
  if (minutes < 90) return 'short';
  if (minutes < 240) return 'medium';
  return 'long';
}

export interface FacilityStatus {
  /** Short human label, e.g. "Open", "Currently closed", "Closing soon". */
  label: string;
  /** True when the site is closed or wait is unavailable (de-emphasize / sort lower). */
  unavailable: boolean;
}

/** Derive a display status from the AHS site flags. */
export function facilityStatus(f: Pick<MergedFacility, 'siteOpen' | 'closingSoon' | 'unavailable'>): FacilityStatus {
  if (!f.siteOpen) return { label: 'Currently closed', unavailable: true };
  if (f.unavailable) return { label: 'Wait time unavailable', unavailable: true };
  if (f.closingSoon) return { label: 'Closing soon', unavailable: false };
  return { label: 'Open', unavailable: false };
}

/**
 * Sort facilities for the list: open + available first (shortest wait first),
 * then closing-soon, then unavailable/closed sites last.
 */
export function sortByWait(a: MergedFacility, b: MergedFacility): number {
  const sa = facilityStatus(a);
  const sb = facilityStatus(b);
  if (sa.unavailable !== sb.unavailable) return sa.unavailable ? 1 : -1;
  const wa = a.waitMinutes ?? Number.POSITIVE_INFINITY;
  const wb = b.waitMinutes ?? Number.POSITIVE_INFINITY;
  return wa - wb;
}
