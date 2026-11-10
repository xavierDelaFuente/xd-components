import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

// jsdom doesn't apply imported CSS (css: false), so the layout contract is
// asserted on the stylesheet itself.
describe('ToggleGroup.css', () => {
  const css = readFileSync(
    resolve(__dirname, '../components/ToggleGroup.css'),
    'utf-8',
  );
  const group = css.split('.xd-toggle-group {')[1]?.split('}')[0] ?? '';

  it('lays items out in a wrapping row', () => {
    expect(group).toContain('display: inline-flex;');
    expect(group).toContain('flex-wrap: wrap;');
  });

  it('spaces items with a theme spacing token, so they never touch', () => {
    expect(group).toContain('gap: var(--xd-space-sm');
  });
});
