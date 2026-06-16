// Refresh the committed AHS snapshot (scripts/ahs-snapshot.json) from the live feed.
// Usage: node scripts/fetch-ahs.mjs
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { AHS_FEED_URL } from './ahs-normalize.mjs';

const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const res = await fetch(AHS_FEED_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`AHS feed responded ${res.status}`);
  const json = await res.json();
  const out = join(here, 'ahs-snapshot.json');
  await writeFile(out, JSON.stringify(json, null, 2), 'utf8');
  const regions = Object.keys(json).length;
  console.log(`Wrote ${out} (${regions} regions).`);
}

main().catch((err) => {
  console.error('fetch-ahs failed:', err);
  process.exit(1);
});
