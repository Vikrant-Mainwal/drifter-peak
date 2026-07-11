'use client';

import { useEffect, useState } from 'react';

/**
 * SSR-safe media query hook.
 * Returns `false` until mounted (avoids hydration mismatch), then tracks
 * the query live via the native matchMedia change listener — no resize
 * polling, no layout thrash.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const handleChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
      return () => mediaQueryList.removeEventListener('change', handleChange);
    }

    // Safari < 14 fallback
    mediaQueryList.addListener(handleChange);
    return () => mediaQueryList.removeListener(handleChange);
  }, [query]);

  return hasMounted ? matches : false;
}

/** Breakpoint used across the address feature — matches Tailwind's `md`. */
export const DESKTOP_QUERY = '(min-width: 768px)';

export function useIsDesktop(): boolean {
  return useMediaQuery(DESKTOP_QUERY);
}
