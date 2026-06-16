import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

import { LastUpdated } from '@/components/LastUpdated';
import { ShareButton } from '@/components/ShareButton';
import { Sparkline } from '@/components/Sparkline';
import { WaitBadge } from '@/components/WaitBadge';
import { regionName } from '@/content/regions';
import { categoryLabel, statusLabel } from '@/i18n/helpers';
import { useMergedFacilities } from '@/hooks/useMergedFacilities';
import { decodeFacilitySlug } from '@/lib/slug';
import { facilityStatus } from '@/lib/waitStatus';
import { getTrend, type TrendPoint } from '@/services/trends';

export function FacilityDetailPage() {
  const { t } = useTranslation();
  const { slug = '' } = useParams();
  const key = useMemo(() => decodeFacilitySlug(slug), [slug]);
  const { facilities, fetchedAt, loading } = useMergedFacilities();
  const [trend, setTrend] = useState<TrendPoint[]>([]);

  const facility = useMemo(
    () => facilities.find((f) => f.key === key) ?? null,
    [facilities, key],
  );

  useEffect(() => {
    let cancelled = false;
    getTrend(key)
      .then((points) => {
        if (!cancelled) setTrend(points);
      })
      .catch(() => {
        /* trend history is best-effort */
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  const trendValues = useMemo(() => trend.map((p) => p.m), [trend]);

  if (!facility) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex min-h-11 items-center rounded text-sm text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
        >
          ← {t('common.actions.backToWaitTimes')}
        </Link>
        <p className="text-hss-gray">
          {loading ? t('facility.loadingFacility') : t('facility.notInFeed')}
        </p>
      </div>
    );
  }

  const status = facilityStatus(facility);

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center rounded text-sm text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
      >
        ← {t('common.actions.backToWaitTimes')}
      </Link>

      <header className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 break-words">
            <h1 className="text-2xl font-bold text-hss-navy">{facility.name}</h1>
            <p className="mt-1 text-sm text-hss-gray">
              {regionName(facility.region)} · {categoryLabel(t, facility.category)}
            </p>
          </div>
          <ShareButton facility={facility} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <WaitBadge facility={facility} />
          <span className="text-sm text-hss-gray">{statusLabel(t, status.label)}</span>
        </div>
        <div className="mt-2">
          <LastUpdated fetchedAt={fetchedAt} />
        </div>
        {facility.note && <p className="mt-3 text-sm text-hss-gray">{facility.note}</p>}
        {facility.address && <p className="mt-1 text-sm text-hss-gray">{facility.address}</p>}
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          {facility.mapUrl && (
            <a
              href={facility.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded px-2 text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
            >
              {t('common.links.directions')}
            </a>
          )}
          {facility.infoUrl && (
            <a
              href={facility.infoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded px-2 text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
            >
              {t('common.links.siteInformation')}
            </a>
          )}
        </div>
      </header>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-hss-navy">{t('facility.recentTrend')}</h2>
        <p className="mt-1 text-xs text-hss-gray">{t('facility.trendDescription')}</p>
        <div className="mt-3">
          <Sparkline values={trendValues} />
        </div>
      </section>
    </div>
  );
}
