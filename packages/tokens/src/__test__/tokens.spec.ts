import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8');

describe('@asnewyla/tokens', () => {
  it('defines the color tokens Button currently hardcodes as light-mode fallbacks', () => {
    expect(css).toContain('--xd-color-primary: #0d9488;');
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

  it("defines a radius scale including Button's current 6px default", () => {
    expect(css).toContain('--xd-radius-sm: 4px;');
    expect(css).toContain('--xd-radius-md: 6px;');
    expect(css).toContain('--xd-radius-lg: 10px;');
    expect(css).toContain('--xd-radius-full: 9999px;');
  });

  it("defines a typography scale matching Button's current font values", () => {
    expect(css).toContain('--xd-font-size-sm: 0.8125rem;');
    expect(css).toContain('--xd-font-size-md: 0.875rem;');
    expect(css).toContain('--xd-font-size-lg: 1rem;');
    expect(css).toContain('--xd-font-weight-semibold: 600;');
    expect(css).toContain('--xd-line-height-normal: 1.25;');
  });
});
