import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { regionName } from '@/content/regions';
import { listNews, type NewsItem } from '@/services/news';

function relativePublishedAt(value: string | Date | null | undefined, language: string | undefined, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (!value) return t('news.publishedUnavailable');

  const date = value instanceof Date ? value : new Date(value);
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return t('news.publishedUnavailable');

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return t('news.publishedJustNow');

  const units = [
    { unit: 'day', seconds: 24 * 60 * 60 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
  ] as const;
  const selected = units.find((candidate) => seconds >= candidate.seconds) ?? units[2];
  const count = Math.max(1, Math.floor(seconds / selected.seconds));
  const locale = language?.toLowerCase().startsWith('fr') ? 'fr-CA' : 'en-CA';
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(-count, selected.unit);
  return t('news.publishedRelative', { relative });
}

export function NewsSection({ limit = 5 }: { limit?: number }) {
  const { i18n, t } = useTranslation();
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    listNews(undefined, limit)
      .then((items) => {
        if (!active) return;
        setArticles(items);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Could not load news section:', err);
        setArticles([]);
        setError(t('news.error'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit, t]);

  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200" aria-busy={loading}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-hss-green">{t('news.sectionLabel')}</p>
          <h2 className="text-xl font-bold text-hss-navy">{t('news.recentHeadlines')}</h2>
        </div>
        <Link
          to="/news"
          className="rounded-md bg-hss-navy px-3 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          {t('news.allNews')}
        </Link>
      </div>

      <div aria-live="polite" className="mt-4 space-y-3">
        {loading && <p className="text-sm text-hss-gray">{t('news.loading')}</p>}
        {error && !loading && <p className="text-sm text-red-700">{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p className="text-sm text-hss-gray">{t('news.empty')}</p>
        )}
        {!loading && !error && articles.length > 0 && (
          <ul className="space-y-3">
            {articles.map((article) => (
              <li key={article.id} className="border-t border-gray-200 pt-3 first:border-t-0 first:pt-0">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-hss-navy hover:text-hss-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                >
                  {article.title}
                </a>
                <p className="mt-1 text-xs text-hss-gray">
                  {article.source} • {relativePublishedAt(article.publishedAt, i18n.resolvedLanguage || i18n.language, t)}
                  {article.region ? ` • ${regionName(article.region)}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
