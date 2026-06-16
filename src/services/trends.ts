export interface TrendPoint {
  /** ISO timestamp of the reading. */
  t: string;
  /** Wait in minutes, or null when unavailable. */
  m: number | null;
}

/** Public trend history, appended hourly by scripts/snapshot.mjs and served statically. */
const HISTORY_URL = '/wait-history.json';

let cache: Record<string, TrendPoint[]> | null = null;

async function loadHistory(): Promise<Record<string, TrendPoint[]>> {
  if (cache) return cache;
  try {
    const res = await fetch(HISTORY_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as Record<string, TrendPoint[]>;
    cache = data && typeof data === 'object' ? data : {};
  } catch {
    cache = {};
  }
  return cache;
}

/** Recent trend points for a facility key (oldest to newest), best-effort. */
export async function getTrend(key: string): Promise<TrendPoint[]> {
  const history = await loadHistory();
  return history[key] ?? [];
}
