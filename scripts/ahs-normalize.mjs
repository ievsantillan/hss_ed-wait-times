// Node (ESM) port of src/lib/ahsTransform.ts for the seed/snapshot scripts.
// Keep behaviour in sync with the TypeScript version.

const FIELD_SEPARATOR = '[;]';

const ENTITIES = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&apos;': "'",
  '&nbsp;': ' ',
};

export function decodeEntities(input) {
  if (!input) return '';
  return String(input)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&[a-z#0-9]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseWaitToMinutes(input) {
  if (!input) return null;
  const text = String(input).toLowerCase();
  const hr = text.match(/(\d+)\s*hr/);
  const min = text.match(/(\d+)\s*min/);
  if (!hr && !min) return null;
  return (hr ? Number(hr[1]) : 0) * 60 + (min ? Number(min[1]) : 0);
}

export function parseGeo(url) {
  if (!url) return { latitude: null, longitude: null };
  const m = String(url).match(/query=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if (!m) return { latitude: null, longitude: null };
  return { latitude: Number(m[1]), longitude: Number(m[2]) };
}

function asBool(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.trim().toLowerCase() === 'true';
  return Boolean(v);
}

function splitField(v) {
  if (v == null) return [''];
  return String(v).split(FIELD_SEPARATOR);
}

function pick(parts, i) {
  return (parts[i] ?? parts[0] ?? '').trim();
}

export function normalizeFacility(raw, region) {
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

  const out = [];
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
      unavailable: unavailable || waitMinutes == null,
      address,
      note: decodeEntities(pick(notes, i)) || null,
      infoUrl: pick(urls, i) || null,
      mapUrl: (raw.GoogleMapsLinkDirection ?? '').trim() || null,
      latitude,
      longitude,
      siteOpen,
      closingSoon,
    });
  }
  return out;
}

export function normalizeAhsFeed(feed) {
  if (!feed || typeof feed !== 'object') return [];
  const result = [];
  for (const [region, value] of Object.entries(feed)) {
    if (!value || typeof value !== 'object') continue;
    for (const groupKey of ['Emergency', 'Urgent']) {
      const arr = value[groupKey];
      if (!Array.isArray(arr)) continue;
      for (const raw of arr) result.push(...normalizeFacility(raw, region));
    }
  }
  return result;
}

export const AHS_FEED_URL =
  'https://www.albertahealthservices.ca/Webapps/WaitTimes/api/waittimes/en';
