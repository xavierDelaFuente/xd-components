import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
  resolve(__dirname, '../components/Button.css'),
  'utf-8',
);

const rule = (selector: string) => {
  const start = css.indexOf(`${selector} {`);
  return start === -1 ? '' : css.slice(start).split('}')[0];
};

// jsdom doesn't compute styles from imported CSS (css: false), so the
// variant's contract is asserted on the stylesheet itself.
describe('Button.css — outline variant', () => {
  const outline = rule('.xd-button[data-variant="outline"]');

  it('has a transparent background and the theme text colour', () => {
    expect(outline).toContain('--_bg: transparent;');
    expect(outline).toContain('--_fg: var(--xd-color-text');
  });

  it('draws a border-strong border at the theme frame width', () => {
    expect(outline).toContain('border-color: var(--xd-color-border-strong');
    expect(outline).toContain('border-width: var(--xd-frame-border-width');
  });

  it('hovers onto the theme surface-hover colour', () => {
    expect(outline).toContain('--_bg-hover: var(--xd-color-surface-hover');
  });

  it('keeps a visible focus ring without tokens (the default ring falls back to --_bg, which is transparent here)', () => {
    expect(rule('.xd-button[data-variant="outline"]:focus-visible')).toContain(
      'outline-color: var(--xd-color-focus, currentColor)',
    );
  });

  it('has dark-mode fallbacks, like the other variants, for use without tokens', () => {
    const dark = css.split('prefers-color-scheme: dark')[1] ?? '';
    const darkOutline = dark.split('.xd-button[data-variant="outline"] {')[1];
    expect(darkOutline).toBeDefined();
    expect(darkOutline?.split('}')[0]).toContain(
      '--_fg: var(--xd-color-text, #f1f5f9);',
    );
  });
});
