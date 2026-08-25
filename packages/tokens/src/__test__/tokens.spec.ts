import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8');

describe('@asnewyla/tokens', () => {
  it('defines the color tokens Button currently hardcodes as light-mode fallbacks', () => {
    expect(css).toContain('--xd-color-primary: #0f766e;');
    expect(css).toContain('--xd-on-primary: #ffffff;');
    expect(css).toContain('--xd-color-secondary: #64748b;');
    expect(css).toContain('--xd-on-secondary: #ffffff;');
    expect(css).toContain('--xd-color-destructive: #dc2626;');
    expect(css).toContain('--xd-on-destructive: #ffffff;');
  });

  it("overrides colors under prefers-color-scheme: dark, matching Button's dark fallbacks", () => {
    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-color-primary: #06b6d4;');
    expect(darkBlock).toContain('--xd-on-primary: #000000;');
    expect(darkBlock).toContain('--xd-color-secondary: #cbd5e1;');
    expect(darkBlock).toContain('--xd-on-secondary: #000000;');
    expect(darkBlock).toContain('--xd-color-destructive: #f87171;');
    expect(darkBlock).toContain('--xd-on-destructive: #000000;');
  });

  it("defines a spacing scale matching Button's current padding/gap values", () => {
    expect(css).toContain('--xd-space-xs: 0.25rem;');
    expect(css).toContain('--xd-space-sm: 0.375rem;');
    expect(css).toContain('--xd-space-md: 0.5rem;');
    expect(css).toContain('--xd-space-lg: 0.75rem;');
    expect(css).toContain('--xd-space-xl: 1rem;');
    expect(css).toContain('--xd-space-2xl: 1.5rem;');
  });

  it('defines a radius scale in rem, consistent with the spacing/typography scales', () => {
    expect(css).toContain('--xd-radius-sm: 0.25rem;');
    expect(css).toContain('--xd-radius-md: 0.375rem;');
    expect(css).toContain('--xd-radius-lg: 0.625rem;');

    expect(css).toContain('--xd-radius-full: 9999px;');
  });

  it('defines a border color token, light mode and dark mode', () => {
    expect(css).toContain('--xd-color-border: #cbd5e1;');
    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-color-border: #475569;');
  });

  it('defines a border-width token in px, deliberately not rem', () => {
    expect(css).toContain('--xd-border-width-thin: 1px;');
  });

  it("defines a typography scale matching Button's current font values", () => {
    expect(css).toContain('--xd-font-size-sm: 0.8125rem;');
    expect(css).toContain('--xd-font-size-md: 0.875rem;');
    expect(css).toContain('--xd-font-size-lg: 1rem;');
    expect(css).toContain('--xd-font-weight-semibold: 600;');
    expect(css).toContain('--xd-line-height-normal: 1.25;');
  });

  it('defines a focus ring width/offset, matching what Button and Input both hardcoded identically', () => {
    expect(css).toContain('--xd-focus-ring-width: 2px;');
    expect(css).toContain('--xd-focus-ring-offset: 2px;');
  });

  it('defines a disabled-state opacity, matching what Button and Input both hardcoded identically', () => {
    expect(css).toContain('--xd-opacity-disabled: 0.5;');
  });

  it('defines a motion token, matching what Button and Input both hardcoded identically', () => {
    expect(css).toContain('--xd-motion-fast: 120ms ease-out;');
  });

  it('defines a surface/text tier, light mode and dark mode — needed by any component that owns a floating surface (e.g. Select)', () => {
    expect(css).toContain('--xd-color-surface: #ffffff;');
    expect(css).toContain('--xd-color-surface-hover: #f1f5f9;');
    expect(css).toContain('--xd-color-text: #0f172a;');
    expect(css).toContain('--xd-color-text-muted: #475569;');

    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-color-surface: #0f172a;');
    expect(darkBlock).toContain('--xd-color-surface-hover: #1e293b;');
    expect(darkBlock).toContain('--xd-color-text: #f1f5f9;');
    expect(darkBlock).toContain('--xd-color-text-muted: #94a3b8;');
  });

  it('defines a stronger border tier for interactive control edges (WCAG 1.4.11, 3:1), separate from the decorative border', () => {
    expect(css).toContain('--xd-color-border-strong: #6b7688;');
    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-color-border-strong: #64748b;');
  });

  it('defines a focus ring color token, independent of primary so it can diverge on a primary-filled control', () => {
    expect(css).toContain('--xd-color-focus: #0f766e;');
    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-color-focus: #06b6d4;');
  });

  it('defines an elevation scale, flattened to none in dark mode', () => {
    expect(css).toContain('--xd-shadow-sm: 0 1px 2px rgb(15 23 42 / 8%);');
    expect(css).toContain('--xd-shadow-md: 0 4px 12px rgb(15 23 42 / 12%);');

    const darkBlock = css.split('prefers-color-scheme: dark')[1] ?? '';
    expect(darkBlock).toContain('--xd-shadow-sm: none;');
    expect(darkBlock).toContain('--xd-shadow-md: none;');
  });

  it('lets an explicit data-mode="light" override force light while the OS prefers dark', () => {
    expect(css).toContain(':root:not([data-mode="light"])');
  });

  it('lets an explicit data-mode="dark" override force dark regardless of the OS preference or prefers-color-scheme', () => {
    const explicitDarkBlock = css.split(':root[data-mode="dark"]')[1] ?? '';
    expect(explicitDarkBlock).toContain('--xd-color-primary: #06b6d4;');
    expect(explicitDarkBlock).toContain('--xd-color-surface: #0f172a;');
    expect(explicitDarkBlock).toContain('--xd-shadow-sm: none;');
  });
});
