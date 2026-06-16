import { facilitySlug } from '@/lib/slug';

export interface FacilitySharePayload {
  title: string;
  text: string;
  url: string;
}

export type ShareResult = 'shared' | 'copied';

function browserOrigin(): string {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return '';
  }

  return window.location.origin;
}

export function facilityShareUrl(facilityKey: string, origin = browserOrigin()): string {
  const path = `/facility/${facilitySlug(facilityKey)}`;
  return origin ? `${origin}${path}` : path;
}

export function facilitySharePayload(facility: { key: string; name: string }): FacilitySharePayload {
  return {
    title: `${facility.name} wait time`,
    text: `View the current wait time for ${facility.name}.`,
    url: facilityShareUrl(facility.key),
  };
}

export async function shareOrCopy(payload: FacilitySharePayload): Promise<ShareResult> {
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share(payload);
      return 'shared';
    } catch (error) {
      if (typeof DOMException !== 'undefined' && error instanceof DOMException && error.name === 'AbortError') {
        throw error;
      }
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.url);
    return 'copied';
  }

  throw new Error('Sharing is not available in this browser.');
}
