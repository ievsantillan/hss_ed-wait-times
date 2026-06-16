/**
 * The seven Alberta Health Services (AHS) regions that report ED / urgent-care
 * wait times. The AHS API keys its top-level object by these region codes; we map
 * each to a human-friendly display name used across the list, filters, map, and news.
 */
export const REGIONS = [
  { code: 'Calgary', name: 'Calgary' },
  { code: 'Edmonton', name: 'Edmonton' },
  { code: 'RedDeer', name: 'Red Deer' },
  { code: 'Lethbridge', name: 'Lethbridge' },
  { code: 'MedicineHat', name: 'Medicine Hat' },
  { code: 'GrandePrairie', name: 'Grande Prairie' },
  { code: 'FortMcMurray', name: 'Fort McMurray' },
] as const;

export type RegionCode = (typeof REGIONS)[number]['code'];

const CODE_TO_NAME = new Map<string, string>(REGIONS.map((r) => [r.code, r.name]));

/** Display name for an AHS region code, falling back to the raw code. */
export function regionName(code: string): string {
  return CODE_TO_NAME.get(code) ?? code;
}

/** All region codes in display order. */
export const REGION_CODES: RegionCode[] = REGIONS.map((r) => r.code);
