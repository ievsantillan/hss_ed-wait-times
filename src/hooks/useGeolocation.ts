import { useCallback, useState } from 'react';

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface UseGeolocation {
  coords: Coords | null;
  loading: boolean;
  error: string | null;
  /** Request the user's location (prompts for permission). */
  request: () => void;
}

/**
 * Browser geolocation, used to sort facilities by distance ("nearest to me").
 * Permission is requested only when {@link request} is called; denial degrades gracefully.
 */
export function useGeolocation(): UseGeolocation {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setError('Location is not available in this browser.');
      return;
    }
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setLoading(false);
      },
      (err) => {
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission was denied.'
            : 'Could not determine your location.',
        );
        setLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  return { coords, loading, error, request };
}
