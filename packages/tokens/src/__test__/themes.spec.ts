import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = {
  'tokens.css': readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8'),
  'theme-paper.css': readFileSync(
    resolve(__dirname, '../theme-paper.css'),
    'utf-8',
  ),
  'theme-sand.css': readFileSync(
    resolve(__dirname, '../theme-sand.css'),
    'utf-8',
  ),
  'theme-lavender.css': readFileSync(
    resolve(__dirname, '../theme-lavender.css'),
    'utf-8',
  ),
} as const;

describe('CSS comment hygiene', () => {
  // A stray `*/` inside a comment's own text (e.g. writing "--xd-surface*/"
  // instead of "--xd-surface,") silently closes the comment early, turning
  // the rest of the comment into real CSS. Caught once by luck via a tsup
  // build warning; this makes it a permanent, fast, non-visual check
  // instead of something that only shows up if someone reads build output.
  it.each(Object.entries(files))(
    '%s has balanced /* */ comment delimiters',
    (_name, css) => {
      const opens = css.match(/\/\*/g)?.length ?? 0;
      const closes = css.match(/\*\//g)?.length ?? 0;
      expect(closes).toBe(opens);
    },
  );
});

describe('theme files — configurable via [data-theme]', () => {
  const themes = [
    {
      file: 'theme-paper.css',
      name: 'paper',
      light: {
        primary: 'oklch(46% 0.12 42)',
        onPrimary: 'oklch(98% 0.012 85)',
        destructive: 'oklch(48% 0.17 25)',
        onDestructive: 'oklch(98% 0.012 85)',
        border: 'oklch(88% 0.022 78)',
        borderStrong: 'oklch(64% 0.03 78)',
        surface: 'oklch(97.5% 0.012 85)',
        surfaceHover: 'oklch(95% 0.018 82)',
        text: 'oklch(26% 0.03 55)',
        textMuted: 'oklch(52% 0.025 60)',
        focus: 'oklch(40% 0.13 42)',
        shadowSm: '0 1px 2px oklch(35% 0.05 60 / 10%)',
        shadowMdLayers: [
          '0 2px 6px oklch(35% 0.05 60 / 14%)',
          '0 8px 24px oklch(35% 0.05 60 / 10%)',
        ],
        radiusSm: '0.5rem',
        radiusMd: '0.625rem',
        radiusLg: '0.875rem',
        motionFast: '180ms cubic-bezier(0.2, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(72% 0.13 55)',
        onPrimary: 'oklch(19% 0.018 55)',
        destructive: 'oklch(64% 0.17 27)',
        onDestructive: 'oklch(19% 0.018 55)',
        border: 'oklch(31% 0.022 58)',
        borderStrong: 'oklch(52% 0.03 58)',
        surface: 'oklch(19% 0.018 55)',
        surfaceHover: 'oklch(23% 0.02 55)',
        text: 'oklch(94% 0.015 80)',
        textMuted: 'oklch(70% 0.02 70)',
        focus: 'oklch(72% 0.13 55)',
      },
    },
    {
      file: 'theme-sand.css',
      name: 'sand',
      light: {
        primary: 'oklch(55% 0.115 50)',
        onPrimary: 'oklch(99% 0.006 75)',
        destructive: 'oklch(58% 0.16 25)',
        onDestructive: 'oklch(99% 0 0)',
        border: 'oklch(89% 0.016 70)',
        borderStrong: 'oklch(64% 0.024 70)',
        surface: 'oklch(98% 0.01 75)',
        surfaceHover: 'oklch(95.5% 0.016 72)',
        text: 'oklch(30% 0.022 60)',
        textMuted: 'oklch(53% 0.02 65)',
        focus: 'oklch(49% 0.125 50)',
        shadowSm: '0 1px 3px oklch(45% 0.04 60 / 8%)',
        shadowMdLayers: [
          '0 3px 10px oklch(45% 0.04 60 / 13%)',
          '0 10px 28px oklch(45% 0.04 60 / 9%)',
        ],
        radiusSm: '0.875rem',
        radiusMd: '1rem',
        radiusLg: '1.25rem',
        motionFast: '200ms cubic-bezier(0.2, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(72% 0.11 50)',
        onPrimary: 'oklch(19% 0.014 60)',
        destructive: 'oklch(68% 0.15 25)',
        onDestructive: 'oklch(19% 0 0)',
        border: 'oklch(32% 0.02 62)',
        borderStrong: 'oklch(52% 0.026 62)',
        surface: 'oklch(21% 0.016 60)',
        surfaceHover: 'oklch(25% 0.02 60)',
        text: 'oklch(95% 0.008 75)',
        textMuted: 'oklch(70% 0.016 68)',
        focus: 'oklch(74% 0.1 50)',
      },
    },
    {
      file: 'theme-lavender.css',
      name: 'lavender',
      light: {
        primary: 'oklch(56% 0.115 295)',
        onPrimary: 'oklch(99% 0 0)',
        destructive: 'oklch(58% 0.16 10)',
        onDestructive: 'oklch(99% 0 0)',
        border: 'oklch(91% 0.016 300)',
        borderStrong: 'oklch(64% 0.028 297)',
        surface: 'oklch(97.5% 0.008 295)',
        surfaceHover: 'oklch(95% 0.014 296)',
        text: 'oklch(27% 0.025 300)',
        textMuted: 'oklch(53% 0.02 298)',
        focus: 'oklch(50% 0.115 295)',
        shadowSm: '0 1px 2px oklch(35% 0.03 295 / 10%)',
        shadowMdLayers: [
          '0 3px 9px oklch(35% 0.03 295 / 13%)',
          '0 9px 26px oklch(35% 0.03 295 / 9%)',
        ],
        radiusSm: '1.125rem',
        radiusMd: '1.25rem',
        radiusLg: '1.5rem',
        motionFast: '260ms cubic-bezier(0.2, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(73% 0.1 295)',
        onPrimary: 'oklch(19% 0.02 295)',
        destructive: 'oklch(69% 0.12 10)',
        onDestructive: 'oklch(19% 0.02 295)',
        border: 'oklch(32% 0.028 295)',
        borderStrong: 'oklch(52% 0.028 295)',
        surface: 'oklch(20% 0.02 295)',
        surfaceHover: 'oklch(24% 0.022 295)',
        text: 'oklch(95% 0.012 295)',
        textMuted: 'oklch(70% 0.018 296)',
        focus: 'oklch(73% 0.1 295)',
      },
    },
  ] as const;

  it.each(themes)(
    '$file exposes a [data-theme="$name"] selector alongside a :root:not([data-theme]) fallback',
    ({ file, name }) => {
      expect(files[file]).toContain(
        `:root:not([data-theme]),\n[data-theme="${name}"] {`,
      );
    },
  );

  it.each(themes)(
    '$file sets its light-mode color/radius/motion tokens',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-color-primary: ${light.primary};`);
      expect(css).toContain(`--xd-on-primary: ${light.onPrimary};`);
      expect(css).toContain(`--xd-color-destructive: ${light.destructive};`);
      expect(css).toContain(`--xd-on-destructive: ${light.onDestructive};`);
      expect(css).toContain(`--xd-color-border: ${light.border};`);
      expect(css).toContain(`--xd-radius-sm: ${light.radiusSm};`);
      expect(css).toContain(`--xd-radius-md: ${light.radiusMd};`);
      expect(css).toContain(`--xd-radius-lg: ${light.radiusLg};`);
      expect(css).toContain('--xd-radius-full: 9999px;');
      expect(css).toContain(`--xd-motion-fast: ${light.motionFast};`);
    },
  );

  it.each(themes)(
    '$file overrides color tokens under prefers-color-scheme: dark, scoped to [data-theme="$name"]',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"]:not([data-mode="light"])`;
      const mediaBlock =
        files[file].split('prefers-color-scheme: dark')[1] ?? '';
      expect(mediaBlock).toContain(marker);
      expect(mediaBlock).toContain(`--xd-color-primary: ${dark.primary};`);
      expect(mediaBlock).toContain(`--xd-on-primary: ${dark.onPrimary};`);
      expect(mediaBlock).toContain(
        `--xd-color-destructive: ${dark.destructive};`,
      );
      expect(mediaBlock).toContain(
        `--xd-on-destructive: ${dark.onDestructive};`,
      );
      expect(mediaBlock).toContain(`--xd-color-border: ${dark.border};`);
    },
  );

  it.each(themes)(
    '$file also exposes an explicit [data-theme="$name"][data-mode="dark"] override with the same dark values',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"][data-mode="dark"] {`;
      const overrideBlock = files[file].split(marker)[1] ?? '';
      expect(files[file]).toContain(marker);
      expect(overrideBlock).toContain(`--xd-color-primary: ${dark.primary};`);
      expect(overrideBlock).toContain(`--xd-on-primary: ${dark.onPrimary};`);
      expect(overrideBlock).toContain(
        `--xd-color-destructive: ${dark.destructive};`,
      );
      expect(overrideBlock).toContain(
        `--xd-on-destructive: ${dark.onDestructive};`,
      );
      expect(overrideBlock).toContain(`--xd-color-border: ${dark.border};`);
    },
  );

  // Surface/text/border-strong/focus/elevation: added so components with a
  // floating surface (Select's popover) can actually read the active theme
  // instead of silently falling back to a hardcoded light-mode literal.
  it.each(themes)(
    '$file sets its light-mode surface/text/border-strong/focus/shadow tokens',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-color-surface: ${light.surface};`);
      expect(css).toContain(`--xd-color-surface-hover: ${light.surfaceHover};`);
      expect(css).toContain(`--xd-color-text: ${light.text};`);
      expect(css).toContain(`--xd-color-text-muted: ${light.textMuted};`);
      expect(css).toContain(`--xd-color-border-strong: ${light.borderStrong};`);
      expect(css).toContain(`--xd-color-focus: ${light.focus};`);
      expect(css).toContain(`--xd-shadow-sm: ${light.shadowSm};`);
      expect(css).toContain('--xd-shadow-md:');
      for (const layer of light.shadowMdLayers) {
        expect(css).toContain(layer);
      }
    },
  );

  it.each(themes)(
    '$file overrides surface/text/border-strong/focus under prefers-color-scheme: dark, and flattens elevation to none',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"]:not([data-mode="light"])`;
      const mediaBlock =
        files[file].split('prefers-color-scheme: dark')[1] ?? '';
      expect(mediaBlock).toContain(marker);
      expect(mediaBlock).toContain(`--xd-color-surface: ${dark.surface};`);
      expect(mediaBlock).toContain(
        `--xd-color-surface-hover: ${dark.surfaceHover};`,
      );
      expect(mediaBlock).toContain(`--xd-color-text: ${dark.text};`);
      expect(mediaBlock).toContain(`--xd-color-text-muted: ${dark.textMuted};`);
      expect(mediaBlock).toContain(
        `--xd-color-border-strong: ${dark.borderStrong};`,
      );
      expect(mediaBlock).toContain(`--xd-color-focus: ${dark.focus};`);
      expect(mediaBlock).toContain('--xd-shadow-sm: none;');
      expect(mediaBlock).toContain('--xd-shadow-md: none;');
    },
  );

  it.each(themes)(
    '$file also carries surface/text/border-strong/focus into the explicit [data-theme="$name"][data-mode="dark"] override',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"][data-mode="dark"] {`;
      const overrideBlock = files[file].split(marker)[1] ?? '';
      expect(overrideBlock).toContain(`--xd-color-surface: ${dark.surface};`);
      expect(overrideBlock).toContain(
        `--xd-color-surface-hover: ${dark.surfaceHover};`,
      );
      expect(overrideBlock).toContain(`--xd-color-text: ${dark.text};`);
      expect(overrideBlock).toContain(
        `--xd-color-text-muted: ${dark.textMuted};`,
      );
      expect(overrideBlock).toContain(
        `--xd-color-border-strong: ${dark.borderStrong};`,
      );
      expect(overrideBlock).toContain(`--xd-color-focus: ${dark.focus};`);
      expect(overrideBlock).toContain('--xd-shadow-sm: none;');
      expect(overrideBlock).toContain('--xd-shadow-md: none;');
    },
  );

  it.each(themes)(
    '$file leaves --xd-color-secondary at the shared default (never defined by the source design drafts)',
    ({ file }) => {
      expect(files[file]).toContain('--xd-color-secondary: #64748b;');
      expect(files[file]).toContain('--xd-on-secondary: #ffffff;');
    },
  );

  it.each(themes)(
    "$file's dark-mode blocks also guard their bare :root fallback with :not([data-theme])",
    ({ file, name }) => {
      const css = files[file];
      expect(css).toContain(
        `:root:not([data-theme]):not([data-mode="light"]),\n  [data-theme="${name}"]:not([data-mode="light"]) {`,
      );
      expect(css).toContain(
        `:root:not([data-theme])[data-mode="dark"],\n[data-theme="${name}"][data-mode="dark"] {`,
      );
    },
  );

  it.each(themes)(
    "$file's bare :root fallback never regresses to the unguarded, order-dependent form",
    ({ file, name }) => {
      // Regression guard for the bug:
      // unguarded `:root` has the same specificity as [data-theme="x"], so
      // whichever theme file is imported last silently wins on every
      // element -- including one with an explicitly *different*
      // data-theme set -- regardless of which theme is actually active.
      const css = files[file];
      expect(css).not.toContain(`:root,\n[data-theme="${name}"] {`);
      expect(css).not.toContain(
        `:root:not([data-mode="light"]),\n  [data-theme="${name}"]:not([data-mode="light"]) {`,
      );
      expect(css).not.toContain(
        `:root[data-mode="dark"],\n[data-theme="${name}"][data-mode="dark"] {`,
      );
    },
  );
});
