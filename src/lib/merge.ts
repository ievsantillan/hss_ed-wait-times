import type { NormalizedFacility } from './ahsTransform';

/** A facility row as shown in the UI: live AHS data, optionally overridden by the catalog. */
export interface MergedFacility extends NormalizedFacility {
  /** Rayfin catalog id, when this facility exists in the data layer (enables detail/admin). */
  catalogId: string | null;
  /** True when an admin override (from the catalog) replaced the live value. */
  overridden: boolean;
  /** True when this facility comes only from the catalog (not in the live AHS feed). */
  catalogOnly: boolean;
}

/** Minimal shape of a catalog Facility row needed for merging. */
export interface CatalogFacility {
  id: string;
  name: string;
  region: string;
  category: string;
  siteId?: string | null;
  address?: string | null;
  note?: string | null;
  infoUrl?: string | null;
  mapUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  siteOpen?: boolean | null;
  active?: boolean | null;
  currentWaitMinutes?: number | null;
  currentWaitUnavailable?: boolean | null;
  waitUpdatedAt?: string | Date | null;
}

function matchKey(siteId: string | null | undefined, name: string, category: string): string {
  return `${(siteId ?? '').trim()}:${name.trim().toLowerCase()}:${category.trim().toLowerCase()}`;
}

/**
 * Merge the live AHS feed with the Rayfin catalog.
 *
 * - Live AHS data is the default for display.
 * - A matching catalog row with a fresher manual override replaces the live wait value.
 * - Catalog-only facilities (active, not in the live feed) are appended.
 */
export function mergeFacilities(
  live: NormalizedFacility[],
  catalog: CatalogFacility[],
): MergedFacility[] {
  const catalogByKey = new Map<string, CatalogFacility>();
  for (const c of catalog) {
    catalogByKey.set(matchKey(c.siteId, c.name, c.category), c);
  }

  const matched = new Set<string>();
  const merged: MergedFacility[] = live.map((f) => {
    const key = matchKey(f.siteId, f.name, f.category);
    const c = catalogByKey.get(key);
    if (!c) {
      return { ...f, catalogId: null, overridden: false, catalogOnly: false };
    }
    matched.add(key);
    const hasOverride = c.currentWaitMinutes != null || c.currentWaitUnavailable === true;
    if (!hasOverride) {
      return { ...f, catalogId: c.id, overridden: false, catalogOnly: false };
    }
    return {
      ...f,
      waitMinutes: c.currentWaitUnavailable ? null : c.currentWaitMinutes ?? null,
      unavailable: Boolean(c.currentWaitUnavailable) || c.currentWaitMinutes == null,
      note: c.note ?? f.note,
      catalogId: c.id,
      overridden: true,
      catalogOnly: false,
    };
  });

  for (const c of catalog) {
    const key = matchKey(c.siteId, c.name, c.category);
    if (matched.has(key)) continue;
    if (c.active === false) continue;
    merged.push({
      key,
      siteId: c.siteId ?? '',
      name: c.name,
      region: c.region,
      category: c.category,
      waitMinutes: c.currentWaitUnavailable ? null : c.currentWaitMinutes ?? null,
      waitText: null,
      unavailable: Boolean(c.currentWaitUnavailable) || c.currentWaitMinutes == null,
      address: c.address ?? null,
      note: c.note ?? null,
      infoUrl: c.infoUrl ?? null,
      mapUrl: c.mapUrl ?? null,
      latitude: c.latitude ?? null,
      longitude: c.longitude ?? null,
      siteOpen: c.siteOpen ?? true,
      closingSoon: false,
      catalogId: c.id,
      overridden: false,
      catalogOnly: true,
    });
  }

  return merged;
}
