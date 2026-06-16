import { normalizeAhsFeed, type NormalizedFacility } from '@/lib/ahsTransform';

/**
 * The live Alberta Health Services wait-times feed. Verified to return
 * `Access-Control-Allow-Origin: *` and `Cache-Control: no-cache`, so the browser can
 * poll it cross-origin every two minutes without a proxy.
 */
export const AHS_FEED_URL =
  'https://www.albertahealthservices.ca/Webapps/WaitTimes/api/waittimes/en';

export interface LiveWaitTimes {
  facilities: NormalizedFacility[];
  fetchedAt: Date;
}

/** Fetch and normalize the live AHS feed. Throws on network/HTTP failure. */
export async function fetchLiveWaitTimes(signal?: AbortSignal): Promise<LiveWaitTimes> {
  const res = await fetch(AHS_FEED_URL, { signal, cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`AHS feed responded ${res.status}`);
  }
  const json: unknown = await res.json();
  return { facilities: normalizeAhsFeed(json), fetchedAt: new Date() };
}
