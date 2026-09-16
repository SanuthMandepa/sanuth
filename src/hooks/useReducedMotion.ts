"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};

/**
 * Reactive `prefers-reduced-motion`, safe to read during render.
 *
 * useSyncExternalStore is the sanctioned way to read a browser-only value
 * without a hydration mismatch: the server snapshot is always `false`, and
 * React re-renders with the real value once hydrated.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
