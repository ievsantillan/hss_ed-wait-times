/**
 * Shared, dependency-free helpers for normalizing the Alberta Health Services (AHS)
 * wait-times feed. Used by both the in-browser live hook (`liveWaitTimes.ts`) and the
 * Node seed/snapshot scripts, so it must stay free of browser- or Node-only APIs.
 *
 * AHS feed shape (verified): the top-level object is keyed by region code; each region
 * has `Emergency` and `Urgent` arrays of facility records. Some records are "split"
 * facilities whose string fields pack multiple sub-sites separated by `[;]`.
 */

/** A single, flattened facility reading derived from the AHS feed. */
export interface NormalizedFacility {
  /** Stable-ish key for merging with the Rayfin catalog: `${siteId}:${name}:${category}`. */
  key: string;
  siteId: string;
  name: string;
  region: string;
  /** Display category, e.g. "Emergency" or "Urgent Care". */
  category: string;
  waitMinutes: number | null;
  /** Original AHS wait string, e.g. "3 hr 0 min", or null when unavailable. */
  waitText: string | null;
  unavailable: boolean;
  address: string | null;
  note: string | null;
  infoUrl: string | null;
  mapUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  siteOpen: boolean;
  closingSoon: boolean;
}

const FIELD_SEPARATOR = '[;]';

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

/** Decode the small set of HTML entities AHS emits, and collapse `<br />` to spaces. */
export function decodeEntities(input: string | null | undefined): string {
  if (!input) return '';
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

/** Parse an AHS wait string ("3 hr 0 min", "45 min", "1 hr") into total minutes. */
export function parseWaitToMinutes(input: string | null | undefined): number | null {
  if (!input) return null;
  const text = input.toLowerCase();
  const hrMatch = text.match(/(\d+)\s*hr/);
  const minMatch = text.match(/(\d+)\s*min/);
  if (!hrMatch && !minMatch) return null;
  const hours = hrMatch ? Number(hrMatch[1]) : 0;
  const mins = minMatch ? Number(minMatch[1]) : 0;
  return hours * 60 + mins;
}

/** Format minutes back into the AHS-style "H hr M min" string. */
export function formatWaitMinutes(minutes: number | null | undefined): string {
  if (minutes == null || Number.isNaN(minutes)) return 'Unavailable';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h} hr ${m} min`;
}

/** Extract `{ latitude, longitude }` from a Google Maps directions URL `query=lat,lng`. */
export function parseGeo(
  url: string | null | undefined,
): { latitude: number | null; longitude: number | null } {
  if (!url) return { latitude: null, longitude: null };
  const m = url.match(/query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!m) return { latitude: null, longitude: null };
  return { latitude: Number(m[1]), longitude: Number(m[2]) };
}

function asBool(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true';
  return Boolean(value);
}

function splitField(value: unknown): string[] {
  if (value == null) return [''];
  return String(value).split(FIELD_SEPARATOR);
}

function pick(parts: string[], i: number): string {
  return (parts[i] ?? parts[0] ?? '').trim();
}

interface RawFacility {
  Name?: string;
  Category?: string;
  WaitTime?: string;
  URL?: string;
  Note?: string;
  TimesUnavailable?: string | boolean;
  Address?: string;
  GoogleMapsLinkDirection?: string;
  SiteId?: string;
  SplitFacility?: string | boolean;
  SiteClosingSoon?: string | boolean;
  SiteOpen?: string | boolean;
}

/** Normalize one raw AHS facility record into one-or-more flattened facilities. */
export function normalizeFacility(raw: RawFacility, region: string): NormalizedFacility[] {
  const names = splitField(raw.Name);
  const categories = splitField(raw.Category);
  const waits = splitField(raw.WaitTime);
  const urls = splitField(raw.URL);
  const notes = splitField(raw.Note);
  const count = Math.max(names.length, categories.length, waits.length);

  const unavailable = asBool(raw.TimesUnavailable);
  const siteOpen = raw.SiteOpen == null ? true : asBool(raw.SiteOpen);
  const closingSoon = asBool(raw.SiteClosingSoon);
  const { latitude, longitude } = parseGeo(raw.GoogleMapsLinkDirection);
  const address = decodeEntities(raw.Address) || null;
  const siteId = (raw.SiteId ?? '').trim();

  const out: NormalizedFacility[] = [];
  for (let i = 0; i < count; i++) {
    const name = decodeEntities(pick(names, i));
    if (!name) continue;
    const category = decodeEntities(pick(categories, i)) || 'Emergency';
    const waitText = pick(waits, i);
    const waitMinutes = unavailable ? null : parseWaitToMinutes(waitText);
    out.push({
      key: `${siteId}:${name}:${category}`,
      siteId,
      name,
      region,
      category,
      waitMinutes,
      waitText: unavailable ? null : waitText || null,
      unavailable: unavailable || waitMinutes == null,
      address,
      note: decodeEntities(pick(notes, i)) || null,
      infoUrl: pick(urls, i) || null,
      mapUrl: raw.GoogleMapsLinkDirection?.trim() || null,
      latitude,
      longitude,
      siteOpen,
      closingSoon,
    });
  }
  return out;
}

/** Flatten the entire AHS feed (all regions, Emergency + Urgent) into one array. */
export function normalizeAhsFeed(feed: unknown): NormalizedFacility[] {
  if (!feed || typeof feed !== 'object') return [];
  const result: NormalizedFacility[] = [];
  for (const [region, value] of Object.entries(feed as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const groups = value as Record<string, unknown>;
    for (const groupKey of ['Emergency', 'Urgent']) {
      const arr = groups[groupKey];
      if (!Array.isArray(arr)) continue;
      for (const raw of arr) {
        result.push(...normalizeFacility(raw as RawFacility, region));
      }
    }
  }
  return result;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
];

/**
 * Format a timestamp the way AHS does, e.g. `Jun 16, 2:59 pm`.
 * Pass `withSuffix` to append ` (updated every two minutes)`.
 */
export function formatUpdatedAt(date: Date, withSuffix = false): string {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  const base = `${month} ${day}, ${hours}:${minutes} ${ampm}`;
  return withSuffix ? `${base} (updated every two minutes)` : base;
}
