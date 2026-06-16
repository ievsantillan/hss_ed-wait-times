import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import L, { type LatLngBoundsExpression } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import { categoryLabel, formatWaitMinutesLabel, statusLabel } from '@/i18n/helpers';
import type { MergedFacility } from '@/lib/merge';
import { facilitySlug } from '@/lib/slug';
import { facilityStatus, waitSeverity } from '@/lib/waitStatus';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALBERTA_CENTER: [number, number] = [53.9333, -116.5765];

const STATUS_DOT_CLASS = {
  short: 'bg-hss-green',
  medium: 'bg-amber-500',
  long: 'bg-red-600',
  unknown: 'bg-gray-400',
} as const;

interface MapViewProps {
  facilities: MergedFacility[];
}

type MappedFacility = MergedFacility & {
  latitude: number;
  longitude: number;
};

function hasCoordinates(facility: MergedFacility): facility is MappedFacility {
  return facility.latitude != null && facility.longitude != null;
}

function FitFacilityBounds({ bounds, label }: { bounds: LatLngBoundsExpression | null; label: string }) {
  const map = useMap();

  useEffect(() => {
    map.getContainer().setAttribute('aria-label', label);
    if (!bounds) return;
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 13 });
  }, [bounds, label, map]);

  return null;
}

export default function MapView({ facilities }: MapViewProps) {
  const { t } = useTranslation();
  const mappedFacilities = useMemo(
    () => facilities.filter(hasCoordinates),
    [facilities],
  );

  const bounds = useMemo<LatLngBoundsExpression | null>(() => {
    if (mappedFacilities.length === 0) return null;
    return mappedFacilities.map((facility) => [facility.latitude, facility.longitude] as [number, number]);
  }, [mappedFacilities]);

  const waitLabel = (facility: MergedFacility): string => {
    const status = facilityStatus(facility);
    return status.unavailable ? statusLabel(t, status.label) : formatWaitMinutesLabel(t, facility.waitMinutes);
  };

  if (mappedFacilities.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-hss-gray">
        {t('home.noMappedFacilities')}
      </div>
    );
  }

  const mapLabel = t('home.interactiveMap');

  return (
    <div
      role="region"
      aria-label={mapLabel}
      className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
    >
      <MapContainer
        center={ALBERTA_CENTER}
        zoom={5}
        scrollWheelZoom={false}
        className="h-[32rem] min-h-96 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitFacilityBounds bounds={bounds} label={mapLabel} />
        {mappedFacilities.map((facility) => {
          const status = facilityStatus(facility);
          const severity = waitSeverity(facility.waitMinutes);

          return (
            <Marker
              key={facility.key}
              position={[facility.latitude, facility.longitude]}
              opacity={status.unavailable ? 0.55 : 1}
              title={`${facility.name}: ${waitLabel(facility)}`}
            >
              <Popup>
                <div className="min-w-48 space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-hss-navy">{facility.name}</p>
                    <p className="text-xs text-hss-gray">{categoryLabel(t, facility.category)}</p>
                  </div>
                  <p className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`inline-block h-2.5 w-2.5 rounded-full ${STATUS_DOT_CLASS[severity]}`}
                    />
                    <span>{waitLabel(facility)}</span>
                  </p>
                  <Link
                    to={`/facility/${facilitySlug(facility.key)}`}
                    className="font-medium text-hss-navy underline underline-offset-2 hover:text-hss-green"
                  >
                    {t('home.viewFacilityDetails')}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
