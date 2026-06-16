import { getRayfinClient } from './rayfinClient';
import type { CatalogFacility } from '@/lib/merge';

const FACILITY_FIELDS = [
  'id',
  'name',
  'region',
  'category',
  'siteId',
  'address',
  'note',
  'infoUrl',
  'mapUrl',
  'latitude',
  'longitude',
  'siteOpen',
  'active',
  'currentWaitMinutes',
  'currentWaitUnavailable',
  'waitUpdatedAt',
] as const;

export interface FacilityInput {
  name: string;
  region: string;
  category: string;
  siteId?: string;
  address?: string;
  note?: string;
  infoUrl?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  siteOpen?: boolean;
  active?: boolean;
}

export interface ReadingRow {
  id: string;
  waitMinutes?: number | null;
  unavailable: boolean;
  reportedAt: string | Date;
  source: string;
}

/** List all catalog facilities (used to merge over live AHS data and for admin). */
export async function listFacilities(): Promise<CatalogFacility[]> {
  const client = getRayfinClient();
  const results = await client.data.Facility.select([...FACILITY_FIELDS]).execute();
  return results as unknown as CatalogFacility[];
}

/** Fetch a single catalog facility by id. */
export async function getFacility(id: string): Promise<CatalogFacility | null> {
  const client = getRayfinClient();
  const result = await client.data.Facility.findById(id);
  return (result as unknown as CatalogFacility) ?? null;
}

export async function createFacility(input: FacilityInput): Promise<CatalogFacility> {
  const client = getRayfinClient();
  const created = await client.data.Facility.create({
    siteOpen: true,
    active: true,
    currentWaitUnavailable: false,
    ...input,
  });
  return created as unknown as CatalogFacility;
}

export async function updateFacility(
  id: string,
  input: Partial<FacilityInput>,
): Promise<void> {
  const client = getRayfinClient();
  await client.data.Facility.update({ id }, input);
}

export async function deleteFacility(id: string): Promise<void> {
  const client = getRayfinClient();
  await client.data.Facility.delete({ id });
}

/** Recent wait readings for a facility, newest first. */
export async function listReadings(facilityId: string, limit = 24): Promise<ReadingRow[]> {
  const client = getRayfinClient();
  const page = await client.data.WaitReading.select([
    'id',
    'waitMinutes',
    'unavailable',
    'reportedAt',
    'source',
  ])
    .where({ facility: { id: { eq: facilityId } } })
    .orderBy({ reportedAt: 'desc' })
    .first(limit)
    .executePaginated();
  return (page.items ?? []) as unknown as ReadingRow[];
}

/**
 * Record a manual wait reading: writes a {@link WaitReading} history row and updates the
 * facility's denormalized current snapshot. `minutes === null` marks the wait unavailable.
 */
export async function recordWait(
  facilityId: string,
  minutes: number | null,
  source = 'admin',
): Promise<void> {
  const client = getRayfinClient();
  const now = new Date();
  const unavailable = minutes == null;
  await client.data.WaitReading.create({
    facility: { id: facilityId },
    waitMinutes: minutes ?? undefined,
    unavailable,
    reportedAt: now,
    source,
  });
  await client.data.Facility.update(
    { id: facilityId },
    {
      currentWaitMinutes: minutes ?? undefined,
      currentWaitUnavailable: unavailable,
      waitUpdatedAt: now,
    },
  );
}
