import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

// jsdom doesn't apply imported CSS (css: false), so the layout contract is
// asserted on the stylesheet itself.
describe('ButtonGroup.css', () => {
  const css = readFileSync(
    resolve(__dirname, '../components/ButtonGroup.css'),
    'utf-8',
  );
  const group = css.split('.xd-button-group {')[1]?.split('}')[0] ?? '';

  it('lays buttons out in a wrapping row', () => {
    expect(group).toContain('display: inline-flex;');
    expect(group).toContain('flex-wrap: wrap;');
  });

  it('spaces buttons with a theme spacing token, so they never touch', () => {
    expect(group).toContain('gap: var(--xd-space-sm');
  });

  it.each([
    ['md', '--xd-space-md'],
    ['lg', '--xd-space-lg'],
  ])('maps gap="%s" to %s, like Stack/Group', (gap, token) => {
    const rule =
      css.split(`.xd-button-group[data-gap="${gap}"] {`)[1]?.split('}')[0] ??
      '';
    expect(rule).toContain(`gap: var(${token}`);
  });
});
