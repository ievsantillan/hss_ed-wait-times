import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchLiveWaitTimes, type LiveWaitTimes } from '@/services/liveWaitTimes';

/** How often to re-poll the live AHS feed, matching the AHS "every two minutes" cadence. */
export const REFRESH_INTERVAL_MS = 2 * 60 * 1000;

export interface UseLiveWaitTimes {
  data: LiveWaitTimes | null;
  loading: boolean;
  /** Set when the most recent refresh failed; previous `data` is retained (stale). */
  error: Error | null;
  /** Trigger an immediate refresh (e.g. a "Refresh now" button). */
  refresh: () => void;
}

/**
 * Poll the live AHS wait-times feed every two minutes.
 *
 * - Keeps the last good response on a failed refresh (shows stale data + an error flag).
 * - Pauses polling while the tab is hidden (`visibilitychange`) to save battery/requests,
 *   and refreshes immediately when the tab becomes visible again.
 */
export function useLiveWaitTimes(): UseLiveWaitTimes {
  const [data, setData] = useState<LiveWaitTimes | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const result = await fetchLiveWaitTimes(controller.signal);
      if (controller.signal.aborted) return;
      setData(result);
      setError(null);
    } catch (err) {
      if (controller.signal.aborted) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      void load();
      intervalId = setInterval(() => void load(), REFRESH_INTERVAL_MS);
    };
    const stop = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = undefined;
    };

    const onVisibility = () => {
      if (document.hidden) {
        stop();
      } else if (!intervalId) {
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
      abortRef.current?.abort();
    };
  }, [load]);

  return { data, loading, error, refresh: () => void load() };
}
