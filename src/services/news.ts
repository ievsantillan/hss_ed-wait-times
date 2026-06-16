export interface NewsItem {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet?: string | null;
  publishedAt?: string | Date | null;
  region?: string | null;
  fetchedAt: string | Date;
}

/** Public news file, regenerated daily by scripts/fetch-news.mjs and served statically. */
const NEWS_URL = '/news.json';

let cache: NewsItem[] | null = null;

async function loadAll(): Promise<NewsItem[]> {
  if (cache) return cache;
  const res = await fetch(NEWS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`news.json responded ${res.status}`);
  const data = (await res.json()) as NewsItem[];
  cache = Array.isArray(data) ? data : [];
  return cache;
}

/**
 * List recent news articles, optionally filtered by region, newest first.
 * Reads the static, publicly served news.json (no authentication required).
 */
export async function listNews(region?: string, limit = 30): Promise<NewsItem[]> {
  const all = await loadAll();
  const filtered = region ? all.filter((n) => n.region === region) : all;
  return filtered
    .slice()
    .sort((a, b) => {
      const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return tb - ta;
    })
    .slice(0, limit);
}
