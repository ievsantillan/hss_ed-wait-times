import { getRayfinClient, initRayfinClient, isLocalBackend } from './rayfinClient';
import type { IAuthService } from './IAuthService';
import { MockAuthService } from './MockAuthService';
import { RayfinAuthService } from './RayfinAuthService';

function isLocalBackendUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === 'localhost' || hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

/**
 * Read VITE_* env vars and initialize the Rayfin data client.
 *
 * The patient-facing app is fully public and does not depend on this (live wait times
 * come straight from the AHS API; news and trends are static JSON). The data client is
 * only used by the staff admin tool, which is gated behind Fabric sign-in.
 */
export function bootstrapApp(): void {
  const apiUrl = import.meta.env.VITE_RAYFIN_API_URL || 'http://localhost:5168';
  const localDev = isLocalBackendUrl(apiUrl);
  const publishableKey = import.meta.env.VITE_RAYFIN_PUBLISHABLE_KEY;

  if (!publishableKey && !localDev) {
    throw new Error(
      'VITE_RAYFIN_PUBLISHABLE_KEY environment variable is required'
    );
  }

  initRayfinClient({
    baseUrl: apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`,
    publishableKey: publishableKey ?? 'local-dev-key',
    localDev,
  });
}

/**
 * Build the auth service used to gate the staff admin tool. Localhost uses a mock;
 * a deployed Fabric backend uses brokered Fabric sign-in (requires VITE_FABRIC_* vars).
 */
export function createAuthService(): IAuthService {
  const client = getRayfinClient();
  if (isLocalBackend()) {
    return new MockAuthService(client);
  }

  const workspaceId = import.meta.env.VITE_FABRIC_WORKSPACE_ID;
  const projectId = import.meta.env.VITE_FABRIC_ITEM_ID;
  const fabricPortalUrl = import.meta.env.VITE_FABRIC_PORTAL_URL;

  if (!workspaceId || !projectId || !fabricPortalUrl) {
    throw new Error(
      'Missing required Fabric config. Set VITE_FABRIC_WORKSPACE_ID, VITE_FABRIC_ITEM_ID, and VITE_FABRIC_PORTAL_URL.'
    );
  }

  return new RayfinAuthService(client, {
    workspaceId,
    projectId,
    fabricPortalUrl,
    returnOrigin: window.location.origin,
  });
}

/** Non-throwing variant for use during React render (e.g. the admin gate). */
export function tryCreateAuthService(): {
  service: IAuthService | null;
  error: string | null;
} {
  try {
    return { service: createAuthService(), error: null };
  } catch (err) {
    return {
      service: null,
      error: err instanceof Error ? err.message : 'Admin authentication is not configured.',
    };
  }
}
