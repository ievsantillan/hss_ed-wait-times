/** Encode/decode a facility's merge key for use as a public URL slug. */
export function facilitySlug(key: string): string {
  return encodeURIComponent(key);
}

export function decodeFacilitySlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}
