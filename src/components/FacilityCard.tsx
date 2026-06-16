import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { ShareButton } from '@/components/ShareButton';
import { WaitBadge } from '@/components/WaitBadge';
import { regionName } from '@/content/regions';
import { categoryLabel, localizedDistance } from '@/i18n/helpers';
import { facilitySlug } from '@/lib/slug';
import type { MergedFacility } from '@/lib/merge';

export interface FacilityCardProps {
  facility: MergedFacility;
  distanceKm?: number | null;
  isFavourite: boolean;
  onToggleFavourite: (key: string) => void;
}

export function FacilityCard({
  facility,
  distanceKm,
  isFavourite,
  onToggleFavourite,
}: FacilityCardProps) {
  const { t } = useTranslation();
  const favouriteLabel = isFavourite ? t('facility.removeFavourite') : t('facility.addFavourite');

  return (
    <article className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 break-words">
          <h3 className="font-semibold text-hss-navy">
            <Link
              to={`/facility/${facilitySlug(facility.key)}`}
              className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
            >
              {facility.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-hss-gray">
            {regionName(facility.region)} · {categoryLabel(t, facility.category)}
            {distanceKm != null && (
              <span className="ml-1 text-hss-navy font-medium">· {localizedDistance(t, distanceKm)}</span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <WaitBadge facility={facility} />
          <button
            type="button"
            onClick={() => onToggleFavourite(facility.key)}
            aria-pressed={isFavourite}
            aria-label={favouriteLabel}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green focus-visible:ring-offset-2"
            title={favouriteLabel}
          >
            <span aria-hidden="true" className={isFavourite ? 'text-hss-green' : 'text-gray-300'}>
              {isFavourite ? '★' : '☆'}
            </span>
          </button>
        </div>
      </div>

      {facility.note && <p className="mt-2 text-sm text-hss-gray">{facility.note}</p>}

      <div className="mt-3 flex flex-wrap items-start gap-x-2 gap-y-2 text-sm">
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
        <ShareButton facility={facility} className="px-2" />
        {facility.overridden && (
          <span className="pt-3 text-xs font-medium text-hss-navy" title={t('common.status.updatedByStaff')}>
            {t('common.status.locallyUpdated')}
          </span>
        )}
      </div>
    </article>
  );
}
