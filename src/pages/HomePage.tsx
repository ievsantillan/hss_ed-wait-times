import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
import { categoryLabel } from '@/i18n/helpers';
import { useFavourites } from '@/hooks/useFavourites';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useMergedFacilities } from '@/hooks/useMergedFacilities';
import { haversineKm } from '@/lib/geo';
import { sortByWait } from '@/lib/waitStatus';

const MapView = lazy(() => import('@/components/MapView'));

function geolocationErrorLabel(t: (key: string) => string, error: string): string {
  switch (error) {
    case 'Location is not available in this browser.':
      return t('home.locationUnavailable');
    case 'Location permission was denied.':
      return t('home.locationPermissionDenied');
    case 'Could not determine your location.':
      return t('home.locationError');
    default:
      return error;
  }
}

export function HomePage() {
  const { t } = useTranslation();
  const { facilities, fetchedAt, loading, error, refresh } = useMergedFacilities();
  const { isFavourite, toggle } = useFavourites();
  const geo = useGeolocation();

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [nearest, setNearest] = useState(false);
  const [view, setView] = useState<'list' | 'map'>('list');

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
        <h1 className="text-2xl font-bold text-hss-navy">{t('common.appName')}</h1>
        <p className="mt-1 text-sm text-hss-gray">{t('common.appSubtitle')}</p>
      </div>

      <WaitTimesIntro />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <LastUpdated fetchedAt={fetchedAt} stale={Boolean(error && fetchedAt)} />
        <button
          type="button"
          onClick={refresh}
          className="rounded-md bg-hss-navy px-3 py-2 text-sm font-medium text-white hover:bg-hss-navy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
        >
          {t('home.refreshNow')}
        </button>
      </div>

      <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <legend className="sr-only">{t('home.filterFacilities')}</legend>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">{t('home.search')}</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">{t('home.region')}</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          >
            <option value="">{t('home.allRegions')}</option>
            {REGIONS.map((r) => (
              <option key={r.code} value={r.code}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium text-hss-gray">{t('home.type')}</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
          >
            <option value="">{t('home.allTypes')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabel(t, c)}
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
          {geo.loading ? t('home.locating') : t('home.nearestToMe')}
        </button>
      </fieldset>

      {geo.error && nearest && <p className="text-sm text-amber-700">{geolocationErrorLabel(t, geo.error)}</p>}

      {loading && facilities.length === 0 && <p className="text-hss-gray">{t('home.loadingWaitTimes')}</p>}
      {error && facilities.length === 0 && <p className="text-red-700">{t('home.loadError')}</p>}

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-hss-navy">{t('home.facilities')}</h2>
        <div className="inline-flex rounded-md border border-gray-300 bg-white p-1" aria-label={t('home.chooseFacilityView')}>
          <button
            type="button"
            aria-pressed={view === 'list'}
            onClick={() => setView('list')}
            className={`rounded px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green ${
              view === 'list' ? 'bg-hss-navy text-white' : 'text-hss-gray hover:text-hss-navy'
            }`}
          >
            {t('home.list')}
          </button>
          <button
            type="button"
            aria-pressed={view === 'map'}
            onClick={() => setView('map')}
            className={`rounded px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green ${
              view === 'map' ? 'bg-hss-navy text-white' : 'text-hss-gray hover:text-hss-navy'
            }`}
          >
            {t('home.map')}
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <section aria-label={t('home.facilitiesList')} className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
      ) : (
        <Suspense
          fallback={
            <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-hss-gray">
              {t('home.loadingMap')}
            </div>
          }
        >
          <MapView facilities={filtered.map(({ f }) => f)} />
        </Suspense>
      )}
      {!loading && filtered.length === 0 && facilities.length > 0 && (
        <p className="text-hss-gray">{t('home.noFilteredFacilities')}</p>
      )}

      <p className="text-xs text-hss-gray">
        {region
          ? t('home.showingFacilitiesInRegion', { shown: filtered.length, total: facilities.length, region: regionName(region) })
          : t('home.showingFacilities', { shown: filtered.length, total: facilities.length })}
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
