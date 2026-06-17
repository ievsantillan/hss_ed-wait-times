import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, '..', 'public', 'news.json');

const REGIONS = [
  { code: 'Calgary', query: 'Calgary Alberta emergency room wait OR hospital' },
  { code: 'Edmonton', query: 'Edmonton Alberta emergency wait OR hospital' },
  { code: 'RedDeer', query: 'Red Deer Alberta hospital emergency' },
  { code: 'Lethbridge', query: 'Lethbridge Alberta emergency department' },
  { code: 'MedicineHat', query: 'Medicine Hat Alberta ER wait OR hospital' },
  { code: 'GrandePrairie', query: 'Grande Prairie Alberta emergency wait OR hospital' },
  { code: 'FortMcMurray', query: 'Fort McMurray Alberta hospital emergency' },
];

const MAX_ITEMS_PER_REGION = 6;
const MAX_TOTAL = 80;
const GOOGLE_NEWS_URL = 'https://news.google.com/rss/search';

// Cities/regions to exclude (non-Alberta)
const EXCLUDE_PATTERNS = [
  /\bOttawa\b/i,
  /\bToronto\b/i,
  /\bVancouver\b/i,
  /\bMontreal\b/i,
  /\bQuebec\b/i,
  /\bWinnipeg\b/i,
  /\bHalifax\b/i,
  /\bSaskatchewan\b/i,
  /\bRegina\b/i,
  /\bSaskatoon\b/i,
  /\bBritish Columbia\b/i,
  /\bOntario\b/i,
  /\bManitoba\b/i,
];

function decodeEntities(input) {
  return input
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#x([0-9a-f]+);/gi, (_, value) => String.fromCodePoint(Number.parseInt(value, 16)))
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)))
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .trim();
}

function stripHtml(input) {
  return decodeEntities(input)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractTag(block, tagName) {
  const match = block.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i'));
  return match ? decodeEntities(match[1]) : '';
}

function extractSource(block, link) {
  const source = extractTag(block, 'source');
  if (source) return stripHtml(source).slice(0, 120);
  try {
    return new URL(link).hostname.replace(/^www\./, '').slice(0, 120);
  } catch {
    return 'Unknown publisher';
  }
}

function parseRssItems(xml) {
  const blocks = Array.from(xml.matchAll(/<item\b[\s\S]*?<\/item>/gi), (match) => match[0]);
  return blocks
    .map((block) => {
      const title = stripHtml(extractTag(block, 'title'));
      const link = extractTag(block, 'link').trim();
      const description = stripHtml(extractTag(block, 'description'));
      const pubDate = extractTag(block, 'pubDate').trim();
      const published = pubDate ? new Date(pubDate) : undefined;
      return {
        title,
        url: link,
        source: extractSource(block, link),
        snippet: description || undefined,
        publishedAt: published && !Number.isNaN(published.getTime()) ? published.toISOString() : undefined,
      };
    })
    .filter((item) => item.title && item.url);
}

async function fetchRegion(region) {
  const url = new URL(GOOGLE_NEWS_URL);
  url.searchParams.set('q', region.query);
  url.searchParams.set('hl', 'en-CA');
  url.searchParams.set('gl', 'CA');
  url.searchParams.set('ceid', 'CA:en');

  const response = await fetch(url, { headers: { 'User-Agent': 'hss-ed-wait-times-news/1.0' } });
  if (!response.ok) throw new Error(`Google News returned ${response.status}`);
  const xml = await response.text();
  return parseRssItems(xml).slice(0, MAX_ITEMS_PER_REGION);
}

function trimForField(value, max) {
  return value.length > max ? value.slice(0, max - 1).trimEnd() : value;
}

function slugId(region, url) {
  return `${region}:${url}`.slice(0, 200);
}

function shouldExclude(item) {
  const text = `${item.title} ${item.snippet || ''}`;
  return EXCLUDE_PATTERNS.some((pattern) => pattern.test(text));
}

async function main() {
  const fetchedAt = new Date().toISOString();
  const byUrl = new Map();

  let fetched = 0;
  let filtered = 0;
  let failed = 0;

  for (const region of REGIONS) {
    try {
      const items = await fetchRegion(region);
      fetched += items.length;
      for (const item of items) {
        const url = trimForField(item.url, 1000);
        if (byUrl.has(url)) continue;
        if (shouldExclude(item)) {
          filtered += 1;
          continue;
        }
        byUrl.set(url, {
          id: slugId(region.code, url),
          title: trimForField(item.title, 300),
          source: trimForField(item.source || 'Unknown publisher', 120),
          url,
          snippet: item.snippet ? trimForField(item.snippet, 1000) : null,
          publishedAt: item.publishedAt ?? null,
          region: region.code,
          fetchedAt,
        });
      }
    } catch (err) {
      failed += 1;
      console.error(`Failed to fetch ${region.code}:`, err);
    }
  }

  const articles = Array.from(byUrl.values())
    .sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    })
    .slice(0, MAX_TOTAL);

  await writeFile(OUTPUT_PATH, `${JSON.stringify(articles, null, 2)}\n`, 'utf8');
  console.log(
    `News written to public/news.json: ${articles.length} articles (${fetched} fetched, ${filtered} filtered out, ${failed} regions failed).`,
  );
}

main().catch((err) => {
  console.error('News fetch failed:', err);
  process.exitCode = 1;
});
