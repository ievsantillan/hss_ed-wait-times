import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { LastUpdated } from '@/components/LastUpdated';
import { Sparkline } from '@/components/Sparkline';
import { WaitBadge } from '@/components/WaitBadge';
import { regionName } from '@/content/regions';
import { useMergedFacilities } from '@/hooks/useMergedFacilities';
import { decodeFacilitySlug } from '@/lib/slug';
import { facilityStatus } from '@/lib/waitStatus';
import { getTrend, type TrendPoint } from '@/services/trends';

export function FacilityDetailPage() {
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
        <Link to="/" className="text-sm text-hss-navy hover:underline">
          ← Back to all wait times
        </Link>
        <p className="text-hss-gray">
          {loading ? 'Loading facility…' : 'This facility is not in the current live feed.'}
        </p>
      </div>
    );
  }

  const status = facilityStatus(facility);

  return (
    <div className="space-y-6">
      <Link to="/" className="text-sm text-hss-navy hover:underline">
        ← Back to all wait times
      </Link>

      <header className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-2xl font-bold text-hss-navy">{facility.name}</h1>
        <p className="mt-1 text-sm text-hss-gray">
          {regionName(facility.region)} · {facility.category}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <WaitBadge facility={facility} />
          <span className="text-sm text-hss-gray">{status.label}</span>
        </div>
        <div className="mt-2">
          <LastUpdated fetchedAt={fetchedAt} />
        </div>
        {facility.note && <p className="mt-3 text-sm text-hss-gray">{facility.note}</p>}
        {facility.address && <p className="mt-1 text-sm text-hss-gray">{facility.address}</p>}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          {facility.mapUrl && (
            <a href={facility.mapUrl} target="_blank" rel="noopener noreferrer" className="text-hss-navy hover:underline">
              Directions
            </a>
          )}
          {facility.infoUrl && (
            <a href={facility.infoUrl} target="_blank" rel="noopener noreferrer" className="text-hss-navy hover:underline">
              Site information
            </a>
          )}
        </div>
      </header>

      <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-gray-200">
        <h2 className="text-lg font-semibold text-hss-navy">Recent trend</h2>
        <p className="mt-1 text-xs text-hss-gray">
          Based on hourly snapshots of the live wait time.
        </p>
        <div className="mt-3">
          <Sparkline values={trendValues} />
        </div>
      </section>
    </div>
  );
}
