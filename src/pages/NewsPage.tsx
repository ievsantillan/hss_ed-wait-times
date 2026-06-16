import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { REGIONS, regionName } from '@/content/regions';
import { listNews, type NewsItem } from '@/services/news';

function relativePublishedAt(value: string | Date | null | undefined, language: string | undefined, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (!value) return t('news.publishedUnavailable');

  const date = value instanceof Date ? value : new Date(value);
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return t('news.publishedUnavailable');

  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return t('news.publishedJustNow');

  const units = [
    { unit: 'year', seconds: 365 * 24 * 60 * 60 },
    { unit: 'month', seconds: 30 * 24 * 60 * 60 },
    { unit: 'week', seconds: 7 * 24 * 60 * 60 },
    { unit: 'day', seconds: 24 * 60 * 60 },
    { unit: 'hour', seconds: 60 * 60 },
    { unit: 'minute', seconds: 60 },
  ] as const;

  const selected = units.find((candidate) => seconds >= candidate.seconds) ?? units[5];
  const count = Math.max(1, Math.floor(seconds / selected.seconds));
  const locale = language?.toLowerCase().startsWith('fr') ? 'fr-CA' : 'en-CA';
  const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'always' }).format(-count, selected.unit);
  return t('news.publishedRelative', { relative });
}

function dateTimeAttribute(value: string | Date | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function NewsPage() {
  const { i18n, t } = useTranslation();
  const [region, setRegion] = useState('');
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    listNews(region || undefined)
      .then((items) => {
        if (!active) return;
        setArticles(items);
      })
      .catch((err: unknown) => {
        if (!active) return;
        console.error('Could not load news articles:', err);
        setArticles([]);
        setError(t('news.error'));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [region, t]);

  return (
    <div className="space-y-6" aria-busy={loading}>
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-hss-green">{t('news.sectionLabel')}</p>
        <h1 className="text-2xl font-bold text-hss-navy">{t('news.pageTitle')}</h1>
        <p className="max-w-2xl text-sm text-hss-gray">{t('news.pageIntro')}</p>
      </header>

      <label className="block max-w-xs">
        <span className="text-xs font-medium text-hss-gray">{t('home.region')}</span>
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-hss-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          <option value="">{t('home.allRegions')}</option>
          {REGIONS.map((item) => (
            <option key={item.code} value={item.code}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <p className="rounded-md bg-white p-3 text-xs text-hss-gray shadow-sm">
        {t('news.publisherNotice')}
      </p>

      <div aria-live="polite" className="space-y-4">
        {loading && <p className="text-sm text-hss-gray">{t('news.loading')}</p>}
        {error && !loading && <p className="text-sm text-red-700">{error}</p>}
        {!loading && !error && articles.length === 0 && (
          <p className="text-sm text-hss-gray">{t('news.empty')}</p>
        )}

        {!loading && !error && articles.length > 0 && (
          <section aria-label={t('news.articlesLabel')} className="space-y-3">
            {articles.map((article) => (
              <article key={article.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
                <div className="flex flex-wrap items-center gap-2 text-xs text-hss-gray">
                  <span className="font-semibold text-hss-navy">{article.source}</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={dateTimeAttribute(article.publishedAt)}>
                    {relativePublishedAt(article.publishedAt, i18n.resolvedLanguage || i18n.language, t)}
                  </time>
                  {article.region && (
                    <span className="rounded-full bg-hss-surface px-2 py-1 font-medium text-hss-navy">
                      {regionName(article.region)}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-hss-navy">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-hss-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
                  >
                    {article.title}
                  </a>
                </h2>
                {article.snippet && <p className="mt-2 text-sm text-hss-gray">{article.snippet}</p>}
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
