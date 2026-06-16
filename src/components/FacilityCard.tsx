import { Link } from 'react-router-dom';

import { WaitBadge } from '@/components/WaitBadge';
import { regionName } from '@/content/regions';
import { formatDistance } from '@/lib/geo';
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
  return (
    <article className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-hss-navy">
            <Link
              to={`/facility/${facilitySlug(facility.key)}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green rounded"
            >
              {facility.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-hss-gray">
            {regionName(facility.region)} · {facility.category}
            {distanceKm != null && (
              <span className="ml-1 text-hss-navy font-medium">· {formatDistance(distanceKm)} away</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <WaitBadge facility={facility} />
          <button
            type="button"
            onClick={() => onToggleFavourite(facility.key)}
            aria-pressed={isFavourite}
            aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
            className="rounded p-1 text-lg leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green"
            title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          >
            <span aria-hidden="true" className={isFavourite ? 'text-hss-green' : 'text-gray-300'}>
              {isFavourite ? '★' : '☆'}
            </span>
          </button>
        </div>
      </div>

      {facility.note && <p className="mt-2 text-sm text-hss-gray">{facility.note}</p>}

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        {facility.mapUrl && (
          <a
            href={facility.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green rounded"
          >
            Directions
          </a>
        )}
        {facility.infoUrl && (
          <a
            href={facility.infoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-hss-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hss-green rounded"
          >
            Site information
          </a>
        )}
        {facility.overridden && (
          <span className="text-xs text-hss-green font-medium" title="Updated by HSS staff">
            Locally updated
          </span>
        )}
      </div>
    </article>
  );
}
