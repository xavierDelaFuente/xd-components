import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { THEME_NAMES } from './contrast';

const __dirname = dirname(fileURLToPath(import.meta.url));

const files = ['tokens.css', ...THEME_NAMES.map((t) => `theme-${t}.css`)];

// Themes name fonts but don't load them; loading is the app's job (see the
// README). When a named font isn't loaded, the browser walks the stack, so
// every stack must end in a generic family to fall back to something sane.
describe.each(files)('%s font stacks', (file) => {
  const css = readFileSync(resolve(__dirname, '..', file), 'utf-8');

  it.each([
    ['--xd-font-family', ['sans-serif', 'serif', 'monospace']],
    ['--xd-font-family-mono', ['monospace']],
  ])('%s ends in a generic family', (token, generics) => {
    const value = css.match(new RegExp(`${token}:\\s*([^;]+);`))?.[1];
    expect(value).toBeDefined();
    const last = value?.split(',').at(-1)?.trim();
    expect(generics).toContain(last);
  });
});
