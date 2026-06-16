import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { AHS_FEED_URL, normalizeAhsFeed } from './ahs-normalize.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'wait-history.json');

// Keep roughly two weeks of hourly points per facility.
const MAX_POINTS = 336;

async function loadHistory() {
  try {
    const raw = await readFile(OUTPUT_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

async function fetchFeed() {
  const res = await fetch(AHS_FEED_URL, { headers: { 'User-Agent': 'hss-ed-wait-times-snapshot/1.0' } });
  if (!res.ok) throw new Error(`AHS feed returned ${res.status}`);
  return res.json();
}

async function main() {
  const history = await loadHistory();
  const feed = await fetchFeed();
  const facilities = normalizeAhsFeed(feed);
  const t = new Date().toISOString();

  let updated = 0;
  for (const f of facilities) {
    const points = history[f.key] ?? [];
    points.push({ t, m: f.unavailable ? null : f.waitMinutes });
    history[f.key] = points.slice(-MAX_POINTS);
    updated += 1;
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(history, null, 2)}\n`, 'utf8');
  console.log(`Snapshot appended for ${updated} facilities to public/wait-history.json.`);
}

main().catch((err) => {
  console.error('Snapshot failed:', err);
  process.exitCode = 1;
});
