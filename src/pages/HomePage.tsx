import { useMemo, useState } from 'react';

import { FacilityCard } from '@/components/FacilityCard';
import { LastUpdated } from '@/components/LastUpdated';
import { NewsSection } from '@/components/NewsSection';
import {
  AlertBanner,
  EmergencyCallout,
  FindCare,
  HealthLink811,
  ResourcesList,
  WaitTimesIntro,
} from '@/components/info';
import { REGIONS, regionName } from '@/content/regions';
import { useFavourites } from '@/hooks/useFavourites';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMergedFacilities } from '@/hooks/useMergedFacilities';
import { haversineKm } from '@/lib/geo';
import { sortByWait } from '@/lib/waitStatus';

export function HomePage() {
  const { facilities, fetchedAt, loading, error, refresh } = useMergedFacilities();
  const { isFavourite, toggle } = useFavourites();
  const geo = useGeolocation();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [nearest, setNearest] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = facilities.filter((f) => {
      if (region && f.region !== region) return false;
      if (category && f.category !== category) return false;
      if (q && !f.name.toLowerCase().includes(q)) return false;
      return true;
    });

    const withDistance = rows.map((f) => {
      const distanceKm =
        nearest && geo.coords && f.latitude != null && f.longitude != null
          ? haversineKm(geo.coords.latitude, geo.coords.longitude, f.latitude, f.longitude)
          : null;
      return { f, distanceKm };
    });

    withDistance.sort((a, b) => {
      const favA = isFavourite(a.f.key) ? 0 : 1;
      const favB = isFavourite(b.f.key) ? 0 : 1;
      if (favA !== favB) return favA - favB;
      if (nearest && a.distanceKm != null && b.distanceKm != null) {
        return a.distanceKm - b.distanceKm;
      }
      return sortByWait(a.f, b.f);
    });
    return withDistance;
  }, [facilities, region, category, search, nearest, geo.coords, isFavourite]);

  const categories = useMemo(
    () => Array.from(new Set(facilities.map((f) => f.category))).sort(),
    [facilities],
  );

  const onNearest = () => {
    if (!geo.coords) geo.request();
    setNearest((v) => !v);
  };

  return (
    <div className="space-y-6">
      <AlertBanner />

      <div>
        <h1 className="text-2xl font-bold text-hss-navy">Emergency Department Wait Times</h1>
        <p className="mt-1 text-sm text-hss-gray">
          Estimated wait times for Alberta emergency departments and urgent care centres.
        </p>
      </div>

      <WaitTimesIntro />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <LastUpdated fetchedAt={fetchedAt} stale={Boolean(error && fetchedAt)} />
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-hss-navy px-3 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          Refresh now
        </button>
      </div>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <legend className="sr-only">Filter facilities</legend>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Facility name"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">Region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          >
            <option value="">All regions</option>
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">Type</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          >
            <option value="">All types</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onNearest}
          aria-pressed={nearest}
          className={`mt-auto rounded-md px-3 py-2 text-sm font-medium ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green ${
            nearest ? 'bg-hss-green/15 text-hss-navy ring-hss-green' : 'bg-white text-hss-gray ring-gray-300'
          }`}
        >
          {geo.loading ? 'Locating…' : 'Nearest to me'}
        </button>
      </fieldset>

      {geo.error && nearest && <p className="text-sm text-amber-700">{geo.error}</p>}

      {loading && facilities.length === 0 && (
        <p className="text-hss-gray">Loading live wait times…</p>
      )}
      {error && facilities.length === 0 && (
        <p className="text-red-700">Could not load wait times. Please try again shortly.</p>
      )}

      <section aria-label="Facilities" className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {filtered.map(({ f, distanceKm }) => (
          <FacilityCard
            key={f.key}
            facility={f}
            distanceKm={distanceKm}
            isFavourite={isFavourite(f.key)}
            onToggleFavourite={toggle}
          />
        ))}
      </section>
      {!loading && filtered.length === 0 && facilities.length > 0 && (
        <p className="text-hss-gray">No facilities match your filters.</p>
      )}

      <p className="text-xs text-hss-gray">
        Showing {filtered.length} of {facilities.length} facilities
        {region && ` in ${regionName(region)}`}.
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pt-4 border-t">
        <EmergencyCallout />
        <HealthLink811 />
        <FindCare />
      </div>

      <NewsSection />

      <ResourcesList />
    </div>
  );
}
