/**
 * Plain values, built without 'use client' so server code (e.g. a Next.js
 * layout validating a cookie) can import them from
 * `@asnewyla/theme/constants`.
 */

/** The themes `@asnewyla/tokens` ships, one per `theme-*.css` file. */
export const THEMES = [
  'terra',
  'almanac',
  'block',
  'graphite',
  'rubber',
  'terminal',
] as const;

export type Theme = (typeof THEMES)[number];

/** The `data-mode` values the tokens match. No mode follows `prefers-color-scheme`. */
export const MODES = ['light', 'dark'] as const;

export type Mode = (typeof MODES)[number];

export function isTheme(value: unknown): value is Theme {
  return (
    typeof value === 'string' && (THEMES as readonly string[]).includes(value)
  );
}

export function isMode(value: unknown): value is Mode {
  return (
    typeof value === 'string' && (MODES as readonly string[]).includes(value)
  );
}
