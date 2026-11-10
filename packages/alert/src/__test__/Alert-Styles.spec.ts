import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(
  resolve(__dirname, '../components/Alert.css'),
  'utf-8',
);

const rule = (selector: string) =>
  css.split(`${selector} {`)[1]?.split('}')[0] ?? '';

// jsdom doesn't apply imported CSS (css: false), so the visual contract is
// asserted on the stylesheet itself. Contrast for these token pairs is
// tested in @asnewyla/tokens (status-colours.spec.ts).
describe('Alert.css', () => {
  it('uses the theme text colour on a tinted background, with an accent border', () => {
    const base = rule('.xd-alert');
    expect(base).toContain('color: var(--xd-color-text');
    expect(base).toContain('background-color: var(--_tint)');
    expect(base).toContain('solid var(--_accent)');
  });

  it.each([
    ['error', 'destructive'],
    ['success', 'success'],
    ['info', 'info'],
    ['warning', 'warning'],
  ])('maps tone="%s" to the %s tokens', (tone, token) => {
    const toneRule = rule(`.xd-alert[data-tone="${tone}"]`);
    expect(toneRule).toContain(`--_accent: var(--xd-color-${token},`);
    expect(toneRule).toContain(`--_tint: var(--xd-color-${token}-subtle,`);
  });

  it('keeps links in the message the text colour, underlined', () => {
    const link = rule('.xd-alert a');
    expect(link).toContain('color: inherit');
    expect(link).toContain('text-decoration: underline');
  });

  it('gives links a visible focus ring', () => {
    expect(rule('.xd-alert a:focus-visible')).toContain(
      'outline: var(--xd-focus-ring-width',
    );
  });
});
