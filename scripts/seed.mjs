// Bootstrap / refresh the Rayfin Facility catalog from the AHS snapshot.
// Idempotent: matches existing rows by siteId + name + category, creates or updates.
//
// Usage:
//   node scripts/seed.mjs           (uses committed scripts/ahs-snapshot.json)
//   node scripts/seed.mjs --live    (fetches the live AHS feed instead)
//
// Requires env: RAYFIN_API_URL, RAYFIN_PUBLISHABLE_KEY
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { RayfinClient } from '@microsoft/rayfin-client';

import { AHS_FEED_URL, normalizeAhsFeed } from './ahs-normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));

function makeClient() {
  const baseUrl = process.env.RAYFIN_API_URL;
  const publishableKey = process.env.RAYFIN_PUBLISHABLE_KEY;
  if (!baseUrl || !publishableKey) {
    throw new Error('Set RAYFIN_API_URL and RAYFIN_PUBLISHABLE_KEY environment variables.');
  }
  return new RayfinClient({
    baseUrl: baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
    publishableKey,
    useProxy: false,
    authStorage: false,
  });
}

function matchKey(siteId, name, category) {
  return `${(siteId ?? '').trim()}:${String(name).trim().toLowerCase()}:${String(category).trim().toLowerCase()}`;
}

async function loadFeed() {
  if (process.argv.includes('--live')) {
    const res = await fetch(AHS_FEED_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error(`AHS feed responded ${res.status}`);
    return res.json();
  }
  const raw = await readFile(join(here, 'ahs-snapshot.json'), 'utf8');
  return JSON.parse(raw);
}

async function main() {
  const client = makeClient();
  const feed = await loadFeed();
  const facilities = normalizeAhsFeed(feed);
  console.log(`Normalized ${facilities.length} facilities from the AHS feed.`);

  const existing = await client.data.Facility.select([
    'id',
    'name',
    'region',
    'category',
    'siteId',
  ]).execute();
  const byKey = new Map();
  for (const row of existing) {
    byKey.set(matchKey(row.siteId, row.name, row.category), row);
  }

  let created = 0;
  let updated = 0;
  for (const f of facilities) {
    const fields = {
      name: f.name,
      region: f.region,
      category: f.category,
      siteId: f.siteId || undefined,
      address: f.address || undefined,
      note: f.note || undefined,
      infoUrl: f.infoUrl || undefined,
      mapUrl: f.mapUrl || undefined,
      latitude: f.latitude ?? undefined,
      longitude: f.longitude ?? undefined,
      siteOpen: f.siteOpen,
      active: true,
    };
    const match = byKey.get(matchKey(f.siteId, f.name, f.category));
    try {
      if (match) {
        await client.data.Facility.update({ id: match.id }, fields);
        updated += 1;
      } else {
        await client.data.Facility.create({ ...fields, currentWaitUnavailable: false });
        created += 1;
      }
    } catch (err) {
      console.error(`Failed to upsert "${f.name}" (${f.region}):`, err?.message ?? err);
    }
  }

  console.log(`Seed complete. Created ${created}, updated ${updated}.`);
}

main().catch((err) => {
  console.error('seed failed:', err);
  process.exit(1);
});
