import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = {
  'tokens.css': readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8'),
  'theme-terra.css': readFileSync(
    resolve(__dirname, '../theme-terra.css'),
    'utf-8',
  ),
  'theme-almanac.css': readFileSync(
    resolve(__dirname, '../theme-almanac.css'),
    'utf-8',
  ),
  'theme-block.css': readFileSync(
    resolve(__dirname, '../theme-block.css'),
    'utf-8',
  ),
  'theme-graphite.css': readFileSync(
    resolve(__dirname, '../theme-graphite.css'),
    'utf-8',
  ),
  'theme-rubber.css': readFileSync(
    resolve(__dirname, '../theme-rubber.css'),
    'utf-8',
  ),
  'theme-terminal.css': readFileSync(
    resolve(__dirname, '../theme-terminal.css'),
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
  // Unlike tokens.css's own bare :root, a named theme file has no
  // `:root:not([data-theme])` fallback combined into its selector — it
  // only ever applies when [data-theme="name"] is actually set. tokens.css
  // (via ThemeProvider mounting with no theme prop) is the untagged
  // default; each theme is opt-in on top of it.
  const themes = [
    {
      file: 'theme-terra.css',
      name: 'terra',
      light: {
        primary: 'oklch(52% 0.13 48)',
        onPrimary: 'oklch(98% 0.012 85)',
        secondary: 'oklch(48% 0.05 95)',
        onSecondary: 'oklch(98% 0.012 85)',
        destructive: 'oklch(50% 0.17 27)',
        onDestructive: 'oklch(98% 0.012 85)',
        surface: 'oklch(96.5% 0.018 75)',
        surfaceHover: 'oklch(92% 0.028 72)',
        text: 'oklch(28% 0.024 50)',
        textMuted: 'oklch(49% 0.03 55)',
        spaceXs: '0.3125rem',
        spaceSm: '0.5rem',
        spaceMd: '0.625rem',
        spaceLg: '0.875rem',
        spaceXl: '1.125rem',
        space2xl: '1.75rem',
        space3xl: '2.5rem',
        radiusSm: '0.5rem',
        radiusMd: '0.75rem',
        radiusLg: '1.125rem',
        radiusFull: '9999px',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
        fontSizeSm: '0.8125rem',
        fontSizeMd: '0.9375rem',
        fontSizeLg: '1.0625rem',
        weightRegular: '400',
        weightMedium: '500',
        weightSemibold: '600',
        weightBold: '700',
        lineHeight: '1.4',
        letterSpacingLabel: '0',
        textTransformLabel: 'none',
        border: 'oklch(88% 0.026 72)',
        borderStrong: 'oklch(58% 0.036 60)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: 'var(--xd-border-width-thin)',
        controlBorderWidth: '0',
        controlBorderColor: 'currentColor',
        controlHeightMd: '2.375rem',
        focus: 'oklch(52% 0.13 48)',
        focusWidth: '2px',
        focusOffset: '2px',
        shadowSm: '0 1px 3px oklch(40% 0.04 55 / 10%)',
        shadowMd: '0 6px 16px oklch(40% 0.05 55 / 12%)',
        shadowControl: 'none',
        shadowControlActive: 'none',
        pressTransform: 'none',
        opacity: '0.5',
        motion: '170ms ease-out',
      },
      dark: {
        primary: 'oklch(72% 0.11 50)',
        onPrimary: 'oklch(19% 0.02 50)',
        secondary: 'oklch(76% 0.045 90)',
        onSecondary: 'oklch(19% 0.02 50)',
        destructive: 'oklch(70% 0.15 27)',
        onDestructive: 'oklch(19% 0.02 50)',
        surface: 'oklch(21% 0.018 55)',
        surfaceHover: 'oklch(26% 0.026 55)',
        text: 'oklch(93% 0.016 75)',
        textMuted: 'oklch(72% 0.024 65)',
        border: 'oklch(32% 0.024 60)',
        borderStrong: 'oklch(55% 0.032 60)',
        focus: 'oklch(72% 0.11 50)',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
      },
    },
    {
      file: 'theme-almanac.css',
      name: 'almanac',
      light: {
        primary: 'oklch(32% 0.05 255)',
        onPrimary: 'oklch(98% 0.006 255)',
        secondary: 'oklch(38% 0.015 60)',
        onSecondary: 'oklch(98% 0.006 255)',
        destructive: 'oklch(46% 0.15 25)',
        onDestructive: 'oklch(98% 0.006 255)',
        surface: 'oklch(98% 0.006 90)',
        surfaceHover: 'oklch(94% 0.012 88)',
        text: 'oklch(22% 0.008 60)',
        textMuted: 'oklch(46% 0.012 60)',
        spaceXs: '0.25rem',
        spaceSm: '0.4375rem',
        spaceMd: '0.5625rem',
        spaceLg: '0.875rem',
        spaceXl: '1.125rem',
        space2xl: '1.75rem',
        space3xl: '2.5rem',
        radiusSm: '0.125rem',
        radiusMd: '0.1875rem',
        radiusLg: '0.25rem',
        radiusFull: '9999px',
        fontFamily: '"Source Serif 4", Georgia, "Times New Roman", serif',
        fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
        fontSizeSm: '0.875rem',
        fontSizeMd: '0.9375rem',
        fontSizeLg: '1.0625rem',
        weightRegular: '400',
        weightMedium: '500',
        weightSemibold: '600',
        weightBold: '700',
        lineHeight: '1.35',
        letterSpacingLabel: '0.015em',
        textTransformLabel: 'none',
        border: 'oklch(88% 0.01 80)',
        borderStrong: 'oklch(50% 0.012 60)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: 'var(--xd-border-width-thin)',
        controlBorderWidth: '0',
        controlBorderColor: 'currentColor',
        controlHeightMd: '2.375rem',
        focus: 'oklch(32% 0.05 255)',
        focusWidth: '2px',
        focusOffset: '2px',
        shadowSm: '0 1px 0 oklch(30% 0.01 60 / 12%)',
        shadowMd: '0 2px 7px oklch(30% 0.01 60 / 10%)',
        shadowControl: 'none',
        shadowControlActive: 'none',
        pressTransform: 'none',
        opacity: '0.5',
        motion: '200ms cubic-bezier(0.2, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(76% 0.08 255)',
        onPrimary: 'oklch(18% 0.012 255)',
        secondary: 'oklch(78% 0.014 70)',
        onSecondary: 'oklch(18% 0.012 255)',
        destructive: 'oklch(70% 0.14 28)',
        onDestructive: 'oklch(18% 0.012 255)',
        surface: 'oklch(19% 0.01 60)',
        surfaceHover: 'oklch(24% 0.012 60)',
        text: 'oklch(93% 0.006 85)',
        textMuted: 'oklch(70% 0.012 70)',
        border: 'oklch(31% 0.012 60)',
        borderStrong: 'oklch(54% 0.014 65)',
        focus: 'oklch(76% 0.08 255)',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
      },
    },
    {
      file: 'theme-block.css',
      name: 'block',
      light: {
        primary: 'oklch(56% 0.2 35)',
        onPrimary: 'oklch(99% 0 0)',
        secondary: 'oklch(48% 0.16 250)',
        onSecondary: 'oklch(99% 0 0)',
        destructive: 'oklch(48% 0.2 22)',
        onDestructive: 'oklch(99% 0 0)',
        surface: 'oklch(98% 0.006 90)',
        surfaceHover: 'oklch(93% 0.022 85)',
        text: 'oklch(18% 0.01 60)',
        textMuted: 'oklch(42% 0.016 60)',
        spaceXs: '0.25rem',
        spaceSm: '0.4375rem',
        spaceMd: '0.5625rem',
        spaceLg: '0.875rem',
        spaceXl: '1.125rem',
        space2xl: '1.75rem',
        space3xl: '2.5rem',
        radiusSm: '0',
        radiusMd: '0.125rem',
        radiusLg: '0.25rem',
        radiusFull: '9999px',
        fontFamily: '"Space Grotesk", system-ui, sans-serif',
        fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
        fontSizeSm: '0.8125rem',
        fontSizeMd: '0.9375rem',
        fontSizeLg: '1.0625rem',
        weightRegular: '500',
        weightMedium: '600',
        weightSemibold: '700',
        weightBold: '700',
        lineHeight: '1.25',
        letterSpacingLabel: '0.045em',
        textTransformLabel: 'uppercase',
        border: 'oklch(18% 0.01 60)',
        borderStrong: 'oklch(18% 0.01 60)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: '2px',
        controlBorderWidth: '2px',
        controlBorderColor: 'oklch(18% 0.01 60)',
        controlHeightMd: '2.5rem',
        focus: 'oklch(18% 0.01 60)',
        focusWidth: '3px',
        focusOffset: '3px',
        shadowSm: 'none',
        shadowMd: '6px 6px 0 oklch(18% 0.01 60)',
        shadowControl: '3px 3px 0 oklch(18% 0.01 60)',
        shadowControlActive: '0 0 0 oklch(18% 0.01 60)',
        pressTransform: 'translate(3px, 3px)',
        opacity: '0.5',
        motion: '110ms cubic-bezier(0.2, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(72% 0.17 40)',
        onPrimary: 'oklch(16% 0.012 40)',
        secondary: 'oklch(70% 0.13 250)',
        onSecondary: 'oklch(16% 0.012 40)',
        destructive: 'oklch(70% 0.17 22)',
        onDestructive: 'oklch(16% 0.012 40)',
        surface: 'oklch(17% 0.008 60)',
        surfaceHover: 'oklch(23% 0.016 60)',
        text: 'oklch(97% 0.006 90)',
        textMuted: 'oklch(74% 0.014 70)',
        border: 'oklch(97% 0.006 90)',
        borderStrong: 'oklch(97% 0.006 90)',
        controlBorderColor: 'oklch(97% 0.006 90)',
        focus: 'oklch(97% 0.006 90)',
        shadowSm: 'none',
        shadowMd: '6px 6px 0 oklch(97% 0.006 90)',
        shadowControl: '3px 3px 0 oklch(97% 0.006 90)',
        shadowControlActive: '0 0 0 oklch(97% 0.006 90)',
      },
    },
    {
      file: 'theme-graphite.css',
      name: 'graphite',
      light: {
        primary: 'oklch(48% 0.15 258)',
        onPrimary: 'oklch(99% 0 0)',
        secondary: 'oklch(45% 0.02 262)',
        onSecondary: 'oklch(99% 0 0)',
        destructive: 'oklch(52% 0.19 27)',
        onDestructive: 'oklch(99% 0 0)',
        surface: 'oklch(100% 0 0)',
        surfaceHover: 'oklch(96.5% 0.004 262)',
        text: 'oklch(24% 0.012 262)',
        textMuted: 'oklch(50% 0.014 262)',
        spaceXs: '0.25rem',
        spaceSm: '0.3125rem',
        spaceMd: '0.4375rem',
        spaceLg: '0.625rem',
        spaceXl: '0.875rem',
        space2xl: '1.25rem',
        space3xl: '1.75rem',
        radiusSm: '0.1875rem',
        radiusMd: '0.25rem',
        radiusLg: '0.375rem',
        radiusFull: '9999px',
        fontFamily: '"IBM Plex Sans", system-ui, sans-serif',
        fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
        fontSizeSm: '0.8125rem',
        fontSizeMd: '0.875rem',
        fontSizeLg: '1rem',
        weightRegular: '400',
        weightMedium: '500',
        weightSemibold: '600',
        weightBold: '700',
        lineHeight: '1.3',
        letterSpacingLabel: '0.005em',
        textTransformLabel: 'none',
        border: 'oklch(90% 0.006 262)',
        borderStrong: 'oklch(58% 0.014 262)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: 'var(--xd-border-width-thin)',
        controlBorderWidth: '0',
        controlBorderColor: 'currentColor',
        controlHeightMd: '2rem',
        focus: 'oklch(48% 0.15 258)',
        focusWidth: '2px',
        focusOffset: '2px',
        shadowSm: '0 1px 2px oklch(30% 0.02 262 / 9%)',
        shadowMd: '0 4px 10px oklch(30% 0.02 262 / 11%)',
        shadowControl: 'none',
        shadowControlActive: 'none',
        pressTransform: 'none',
        opacity: '0.5',
        motion: '90ms cubic-bezier(0.3, 0, 0, 1)',
      },
      dark: {
        primary: 'oklch(70% 0.13 258)',
        onPrimary: 'oklch(17% 0.02 262)',
        secondary: 'oklch(78% 0.015 262)',
        onSecondary: 'oklch(17% 0.02 262)',
        destructive: 'oklch(68% 0.16 27)',
        onDestructive: 'oklch(17% 0.02 262)',
        surface: 'oklch(18% 0.012 262)',
        surfaceHover: 'oklch(23% 0.014 262)',
        text: 'oklch(95% 0.005 262)',
        textMuted: 'oklch(72% 0.012 262)',
        border: 'oklch(30% 0.012 262)',
        borderStrong: 'oklch(54% 0.014 262)',
        focus: 'oklch(70% 0.13 258)',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
      },
    },
    {
      file: 'theme-rubber.css',
      name: 'rubber',
      light: {
        primary: 'oklch(56% 0.18 285)',
        onPrimary: 'oklch(99% 0 0)',
        secondary: 'oklch(52% 0.06 290)',
        onSecondary: 'oklch(99% 0 0)',
        destructive: 'oklch(56% 0.19 15)',
        onDestructive: 'oklch(99% 0 0)',
        surface: 'oklch(99% 0.004 290)',
        surfaceHover: 'oklch(95.5% 0.014 292)',
        text: 'oklch(26% 0.03 290)',
        textMuted: 'oklch(51% 0.032 292)',
        spaceXs: '0.3125rem',
        spaceSm: '0.5rem',
        spaceMd: '0.625rem',
        spaceLg: '0.875rem',
        spaceXl: '1.125rem',
        space2xl: '1.75rem',
        space3xl: '2.5rem',
        radiusSm: '0.75rem',
        radiusMd: '1rem',
        radiusLg: '1.5rem',
        radiusFull: '9999px',
        fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
        fontFamilyMono: '"IBM Plex Mono", ui-monospace, monospace',
        fontSizeSm: '0.8125rem',
        fontSizeMd: '0.9375rem',
        fontSizeLg: '1.0625rem',
        weightRegular: '400',
        weightMedium: '500',
        weightSemibold: '700',
        weightBold: '800',
        lineHeight: '1.3',
        letterSpacingLabel: '-0.008em',
        textTransformLabel: 'none',
        border: 'oklch(92% 0.014 292)',
        borderStrong: 'oklch(60% 0.032 290)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: 'var(--xd-border-width-thin)',
        controlBorderWidth: '0',
        controlBorderColor: 'currentColor',
        controlHeightMd: '2.625rem',
        focus: 'oklch(56% 0.18 285)',
        focusWidth: '2px',
        focusOffset: '3px',
        shadowSm: '0 1px 3px oklch(40% 0.05 285 / 10%)',
        shadowMdLayers: [
          '0 8px 24px oklch(40% 0.06 285 / 14%)',
          '0 2px 6px oklch(40% 0.06 285 / 8%)',
        ],
        shadowControl: 'none',
        shadowControlActive: 'none',
        pressTransform: 'scale(0.97)',
        opacity: '0.5',
        motion: '280ms cubic-bezier(0.34, 1.5, 0.64, 1)',
      },
      dark: {
        primary: 'oklch(74% 0.14 285)',
        onPrimary: 'oklch(20% 0.03 290)',
        secondary: 'oklch(80% 0.04 290)',
        onSecondary: 'oklch(20% 0.03 290)',
        destructive: 'oklch(72% 0.15 15)',
        onDestructive: 'oklch(20% 0.03 290)',
        surface: 'oklch(21% 0.025 290)',
        surfaceHover: 'oklch(26% 0.032 290)',
        text: 'oklch(96% 0.01 290)',
        textMuted: 'oklch(74% 0.022 292)',
        border: 'oklch(31% 0.03 290)',
        borderStrong: 'oklch(56% 0.036 290)',
        focus: 'oklch(74% 0.14 285)',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
      },
    },
    {
      file: 'theme-terminal.css',
      name: 'terminal',
      light: {
        primary: 'oklch(45% 0.13 152)',
        onPrimary: 'oklch(98% 0.01 150)',
        secondary: 'oklch(40% 0.015 155)',
        onSecondary: 'oklch(98% 0.01 150)',
        destructive: 'oklch(50% 0.18 25)',
        onDestructive: 'oklch(98% 0.01 150)',
        surface: 'oklch(97.5% 0.006 150)',
        surfaceHover: 'oklch(93.5% 0.014 152)',
        text: 'oklch(22% 0.02 155)',
        textMuted: 'oklch(46% 0.022 155)',
        spaceXs: '0.25rem',
        spaceSm: '0.375rem',
        spaceMd: '0.5rem',
        spaceLg: '0.75rem',
        spaceXl: '1rem',
        space2xl: '1.5rem',
        space3xl: '2rem',
        radiusSm: '0',
        radiusMd: '0',
        radiusLg: '0',
        radiusFull: '0',
        fontFamily:
          '"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace',
        fontFamilyMono: '"JetBrains Mono", ui-monospace, monospace',
        fontSizeSm: '0.75rem',
        fontSizeMd: '0.8125rem',
        fontSizeLg: '0.9375rem',
        weightRegular: '400',
        weightMedium: '500',
        weightSemibold: '600',
        weightBold: '700',
        lineHeight: '1.35',
        letterSpacingLabel: '0.07em',
        textTransformLabel: 'uppercase',
        border: 'oklch(86% 0.014 152)',
        borderStrong: 'oklch(48% 0.022 155)',
        borderThin: '1px',
        borderThick: '2px',
        frameBorderWidth: 'var(--xd-border-width-thin)',
        controlBorderWidth: '1px',
        controlBorderColor:
          'color-mix(in oklab, currentColor 55%, transparent)',
        controlHeightMd: '2rem',
        focus: 'oklch(38% 0.09 152)',
        focusWidth: '2px',
        focusOffset: '0px',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
        pressTransform: 'none',
        opacity: '0.5',
        motion: '60ms linear',
      },
      dark: {
        primary: 'oklch(80% 0.17 148)',
        onPrimary: 'oklch(15% 0.02 155)',
        secondary: 'oklch(82% 0.02 155)',
        onSecondary: 'oklch(15% 0.02 155)',
        destructive: 'oklch(70% 0.16 25)',
        onDestructive: 'oklch(15% 0.02 155)',
        surface: 'oklch(16% 0.014 155)',
        surfaceHover: 'oklch(21% 0.018 155)',
        text: 'oklch(92% 0.03 150)',
        textMuted: 'oklch(68% 0.032 152)',
        border: 'oklch(28% 0.02 155)',
        borderStrong: 'oklch(50% 0.026 155)',
        focus: 'oklch(80% 0.17 148)',
        shadowSm: 'none',
        shadowMd: 'none',
        shadowControl: 'none',
        shadowControlActive: 'none',
      },
    },
  ] as const;

  it.each(themes)(
    '$file only targets [data-theme="$name"] — no bare :root fallback (tokens.css is the untagged default)',
    ({ file, name }) => {
      expect(files[file]).toContain(`[data-theme="${name}"] {`);
      expect(files[file]).not.toContain(
        `:root:not([data-theme]),\n[data-theme="${name}"] {`,
      );
    },
  );

  it.each(themes)(
    '$file paints background-color/color/font-family directly on [data-theme="$name"]',
    ({ file }) => {
      const css = files[file];
      expect(css).toContain('color-scheme: light;');
      expect(css).toContain('background-color: var(--xd-color-surface);');
      expect(css).toContain('color: var(--xd-color-text);');
      expect(css).toContain('font-family: var(--xd-font-family);');
    },
  );

  it.each(themes)(
    '$file sets its light-mode color tokens',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-color-primary: ${light.primary};`);
      expect(css).toContain(`--xd-on-primary: ${light.onPrimary};`);
      expect(css).toContain(`--xd-color-secondary: ${light.secondary};`);
      expect(css).toContain(`--xd-on-secondary: ${light.onSecondary};`);
      expect(css).toContain(`--xd-color-destructive: ${light.destructive};`);
      expect(css).toContain(`--xd-on-destructive: ${light.onDestructive};`);
    },
  );

  it.each(themes)(
    '$file sets its light-mode surface/text tokens',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-color-surface: ${light.surface};`);
      expect(css).toContain(`--xd-color-surface-hover: ${light.surfaceHover};`);
      expect(css).toContain(`--xd-color-text: ${light.text};`);
      expect(css).toContain(`--xd-color-text-muted: ${light.textMuted};`);
    },
  );

  it.each(themes)(
    '$file sets a full spacing scale (xs through 3xl)',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-space-xs: ${light.spaceXs};`);
      expect(css).toContain(`--xd-space-sm: ${light.spaceSm};`);
      expect(css).toContain(`--xd-space-md: ${light.spaceMd};`);
      expect(css).toContain(`--xd-space-lg: ${light.spaceLg};`);
      expect(css).toContain(`--xd-space-xl: ${light.spaceXl};`);
      expect(css).toContain(`--xd-space-2xl: ${light.space2xl};`);
      expect(css).toContain(`--xd-space-3xl: ${light.space3xl};`);
    },
  );

  it.each(themes)('$file sets a radius scale', ({ file, light }) => {
    const css = files[file];
    expect(css).toContain(`--xd-radius-sm: ${light.radiusSm};`);
    expect(css).toContain(`--xd-radius-md: ${light.radiusMd};`);
    expect(css).toContain(`--xd-radius-lg: ${light.radiusLg};`);
    expect(css).toContain(`--xd-radius-full: ${light.radiusFull};`);
  });

  it.each(themes)(
    '$file sets its own font-family (sans + mono) and type scale',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-font-family: ${light.fontFamily};`);
      expect(css).toContain(`--xd-font-family-mono: ${light.fontFamilyMono};`);
      expect(css).toContain(`--xd-font-size-sm: ${light.fontSizeSm};`);
      expect(css).toContain(`--xd-font-size-md: ${light.fontSizeMd};`);
      expect(css).toContain(`--xd-font-size-lg: ${light.fontSizeLg};`);
      expect(css).toContain(`--xd-line-height-normal: ${light.lineHeight};`);
    },
  );

  it.each(themes)(
    '$file sets all four font-weight steps',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(
        `--xd-font-weight-regular: ${light.weightRegular};`,
      );
      expect(css).toContain(`--xd-font-weight-medium: ${light.weightMedium};`);
      expect(css).toContain(
        `--xd-font-weight-semibold: ${light.weightSemibold};`,
      );
      expect(css).toContain(`--xd-font-weight-bold: ${light.weightBold};`);
    },
  );

  it.each(themes)(
    "$file sets its label letter-spacing/text-transform — the theme's own voice for control/form labels",
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(
        `--xd-letter-spacing-label: ${light.letterSpacingLabel};`,
      );
      expect(css).toContain(
        `--xd-text-transform-label: ${light.textTransformLabel};`,
      );
    },
  );

  it.each(themes)(
    '$file sets its border tiers (thin/thick), and the frame/control-border tokens that read from them',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-color-border: ${light.border};`);
      expect(css).toContain(`--xd-color-border-strong: ${light.borderStrong};`);
      expect(css).toContain(`--xd-border-width-thin: ${light.borderThin};`);
      expect(css).toContain(`--xd-border-width-thick: ${light.borderThick};`);
      expect(css).toContain(
        `--xd-frame-border-width: ${light.frameBorderWidth};`,
      );
      expect(css).toContain(
        `--xd-control-border-width: ${light.controlBorderWidth};`,
      );
      expect(css).toContain(
        `--xd-control-border-color: ${light.controlBorderColor};`,
      );
    },
  );

  it.each(themes)('$file sets --xd-control-height-md', ({ file, light }) => {
    expect(files[file]).toContain(
      `--xd-control-height-md: ${light.controlHeightMd};`,
    );
  });

  it.each(themes)('$file sets its focus ring', ({ file, light }) => {
    const css = files[file];
    expect(css).toContain(`--xd-color-focus: ${light.focus};`);
    expect(css).toContain(`--xd-focus-ring-width: ${light.focusWidth};`);
    expect(css).toContain(`--xd-focus-ring-offset: ${light.focusOffset};`);
  });

  it.each(themes)(
    '$file sets its light-mode elevation — surface shadows, control press shadow/transform',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-shadow-sm: ${light.shadowSm};`);
      if ('shadowMdLayers' in light) {
        expect(css).toContain('--xd-shadow-md:');
        for (const layer of light.shadowMdLayers) {
          expect(css).toContain(layer);
        }
      } else {
        expect(css).toContain(`--xd-shadow-md: ${light.shadowMd};`);
      }
      expect(css).toContain(`--xd-shadow-control: ${light.shadowControl};`);
      expect(css).toContain(
        `--xd-shadow-control-active: ${light.shadowControlActive};`,
      );
      expect(css).toContain(`--xd-press-transform: ${light.pressTransform};`);
    },
  );

  it.each(themes)(
    '$file sets disabled opacity and motion duration',
    ({ file, light }) => {
      const css = files[file];
      expect(css).toContain(`--xd-opacity-disabled: ${light.opacity};`);
      expect(css).toContain(`--xd-motion-fast: ${light.motion};`);
    },
  );

  it.each(themes)(
    '$file overrides color tokens under prefers-color-scheme: dark, scoped to [data-theme="$name"]:not([data-mode="light"])',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"]:not([data-mode="light"])`;
      const mediaBlock =
        files[file].split('prefers-color-scheme: dark')[1] ?? '';
      expect(mediaBlock).toContain(marker);
      expect(mediaBlock).toContain(`--xd-color-primary: ${dark.primary};`);
      expect(mediaBlock).toContain(`--xd-on-primary: ${dark.onPrimary};`);
      expect(mediaBlock).toContain(`--xd-color-secondary: ${dark.secondary};`);
      expect(mediaBlock).toContain(`--xd-on-secondary: ${dark.onSecondary};`);
      expect(mediaBlock).toContain(
        `--xd-color-destructive: ${dark.destructive};`,
      );
      expect(mediaBlock).toContain(
        `--xd-on-destructive: ${dark.onDestructive};`,
      );
      expect(mediaBlock).toContain(`--xd-color-surface: ${dark.surface};`);
      expect(mediaBlock).toContain(
        `--xd-color-surface-hover: ${dark.surfaceHover};`,
      );
      expect(mediaBlock).toContain(`--xd-color-text: ${dark.text};`);
      expect(mediaBlock).toContain(`--xd-color-text-muted: ${dark.textMuted};`);
      expect(mediaBlock).toContain(`--xd-color-border: ${dark.border};`);
      expect(mediaBlock).toContain(
        `--xd-color-border-strong: ${dark.borderStrong};`,
      );
      expect(mediaBlock).toContain(`--xd-color-focus: ${dark.focus};`);
      expect(mediaBlock).toContain(`--xd-shadow-sm: ${dark.shadowSm};`);
      expect(mediaBlock).toContain(`--xd-shadow-md: ${dark.shadowMd};`);
      expect(mediaBlock).toContain(
        `--xd-shadow-control: ${dark.shadowControl};`,
      );
      expect(mediaBlock).toContain(
        `--xd-shadow-control-active: ${dark.shadowControlActive};`,
      );
      if ('controlBorderColor' in dark) {
        expect(mediaBlock).toContain(
          `--xd-control-border-color: ${dark.controlBorderColor};`,
        );
      }
    },
  );

  it.each(themes)(
    '$file also exposes an explicit [data-theme="$name"][data-mode="dark"] override with the same dark values',
    ({ file, name, dark }) => {
      const marker = `[data-theme="${name}"][data-mode="dark"] {`;
      const overrideBlock = files[file].split(marker)[1] ?? '';
      expect(files[file]).toContain(marker);
      expect(overrideBlock).toContain(`--xd-color-primary: ${dark.primary};`);
      expect(overrideBlock).toContain(`--xd-color-surface: ${dark.surface};`);
      expect(overrideBlock).toContain(`--xd-color-text: ${dark.text};`);
      expect(overrideBlock).toContain(`--xd-color-focus: ${dark.focus};`);
      expect(overrideBlock).toContain(`--xd-shadow-sm: ${dark.shadowSm};`);
      expect(overrideBlock).toContain(
        `--xd-shadow-control: ${dark.shadowControl};`,
      );
    },
  );

  it.each(themes)(
    '$file keeps typography/spacing/radius/border-width/density/press-transform constant across light and dark — only color and surface/control elevation switch',
    ({ file }) => {
      const mediaBlock =
        files[file].split('prefers-color-scheme: dark')[1] ?? '';
      const explicitBlock =
        files[file].split(/\[data-theme="[a-z]+"\]\[data-mode="dark"\]/)[1] ??
        '';
      for (const block of [mediaBlock, explicitBlock]) {
        expect(block).not.toContain('--xd-space-xs:');
        expect(block).not.toContain('--xd-radius-sm:');
        expect(block).not.toContain('--xd-font-family:');
        expect(block).not.toContain('--xd-font-weight-');
        expect(block).not.toContain('--xd-letter-spacing-label:');
        expect(block).not.toContain('--xd-border-width-');
        expect(block).not.toContain('--xd-control-height-md:');
        expect(block).not.toContain('--xd-press-transform:');
        expect(block).not.toContain('--xd-opacity-disabled:');
        expect(block).not.toContain('--xd-motion-fast:');
      }
    },
  );

  it.each(themes)(
    '$file\'s dark-mode blocks also guard their [data-theme] selector with :not([data-mode="light"])',
    ({ file, name }) => {
      const css = files[file];
      expect(css).toContain(
        `[data-theme="${name}"]:not([data-mode="light"]) {`,
      );
      expect(css).toContain(`[data-theme="${name}"][data-mode="dark"] {`);
    },
  );
});
