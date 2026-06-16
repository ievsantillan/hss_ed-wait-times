import type { CatalogFacility } from '@/lib/merge';

/**
 * Optional public overrides file. Staff can publish admin overrides and non-AHS
 * facilities to a static overrides.json (served publicly) so they appear on the public
 * site without requiring an authenticated read. Defaults to an empty list.
 */
const OVERRIDES_URL = '/overrides.json';

let cache: CatalogFacility[] | null = null;

export async function loadOverrides(): Promise<CatalogFacility[]> {
  if (cache) return cache;
  try {
    const res = await fetch(OVERRIDES_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as CatalogFacility[];
    cache = Array.isArray(data) ? data : [];
  } catch {
    cache = [];
  }
  return cache;
}
