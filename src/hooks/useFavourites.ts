import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'hss-ed-favourites';

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

/** Persisted (localStorage) set of favourite facility keys, pinned to the top of the list. */
export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Ignore quota / privacy-mode failures; favourites are best-effort.
    }
  }, [favourites]);

  const toggle = useCallback((key: string) => {
    setFavourites((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }, []);

  const isFavourite = useCallback(
    (key: string) => favourites.includes(key),
    [favourites],
  );

  return { favourites, toggle, isFavourite };
}
