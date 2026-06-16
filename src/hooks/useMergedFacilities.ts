import { useEffect, useState } from 'react';

import { useLiveWaitTimes } from '@/hooks/useLiveWaitTimes';
import { mergeFacilities, type CatalogFacility, type MergedFacility } from '@/lib/merge';
import { loadOverrides } from '@/services/overrides';

export interface UseMergedFacilities {
  facilities: MergedFacility[];
  fetchedAt: Date | null;
  loading: boolean;
  error: Error | null;
  refresh: () => void;
}

/**
 * Combine the live AHS feed (polled every 2 minutes) with optional public overrides
 * (a static overrides.json published by staff). The patient app reads no authenticated
 * data, so the overrides are loaded best-effort and the page works with pure live data.
 */
export function useMergedFacilities(): UseMergedFacilities {
  const live = useLiveWaitTimes();
  const [overrides, setOverrides] = useState<CatalogFacility[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadOverrides()
      .then((rows) => {
        if (!cancelled) setOverrides(rows);
      })
      .catch(() => {
        // Overrides are supplementary; ignore failures and show live data only.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const facilities = live.data ? mergeFacilities(live.data.facilities, overrides) : [];

  return {
    facilities,
    fetchedAt: live.data?.fetchedAt ?? null,
    loading: live.loading,
    error: live.error,
    refresh: live.refresh,
  };
}
