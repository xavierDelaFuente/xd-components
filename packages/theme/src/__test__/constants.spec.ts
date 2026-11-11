import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { isMode, isTheme, MODES, THEMES } from '../constants';
import * as entry from '../index';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tokensSrc = resolve(__dirname, '../../../tokens/src');

describe('THEMES', () => {
  it('lists exactly the themes @asnewyla/tokens ships, one per theme-*.css file', () => {
    const shipped = readdirSync(tokensSrc)
      .map((file) => file.match(/^theme-([a-z]+)\.css$/)?.[1])
      .filter(Boolean);
    expect([...THEMES].sort()).toEqual(shipped.sort());
  });

  it('matches the [data-theme] name each file is scoped to', () => {
    for (const theme of THEMES) {
      const css = readFileSync(
        resolve(tokensSrc, `theme-${theme}.css`),
        'utf-8',
      );
      expect(css).toContain(`[data-theme="${theme}"] {`);
    }
  });
});

describe('MODES', () => {
  it('lists the data-mode values the tokens match', () => {
    const css = readFileSync(resolve(tokensSrc, 'tokens.css'), 'utf-8');
    expect([...MODES]).toEqual(['light', 'dark']);
    for (const mode of MODES) expect(css).toContain(`[data-mode="${mode}"]`);
  });
});

describe('isTheme / isMode', () => {
  it.each(THEMES)('accepts the theme %s', (theme) => {
    expect(isTheme(theme)).toBe(true);
  });

  it.each(['', 'Terra', 'paper', 'terra ', undefined, null, 42])(
    'rejects %j as a theme',
    (value) => {
      expect(isTheme(value)).toBe(false);
    },
  );

  it.each(MODES)('accepts the mode %s', (mode) => {
    expect(isMode(mode)).toBe(true);
  });

  it.each(['', 'auto', 'system', 'Dark', undefined, null])(
    'rejects %j as a mode',
    (value) => {
      expect(isMode(value)).toBe(false);
    },
  );

  it('narrows a stored string so it can be passed on as a Theme', () => {
    const fromCookie: string = 'terra';
    if (isTheme(fromCookie)) {
      const theme: (typeof THEMES)[number] = fromCookie;
      expect(theme).toBe('terra');
    }
  });
});

describe('main entry', () => {
  it('re-exports the constants for client code', () => {
    expect(entry.THEMES).toBe(THEMES);
    expect(entry.MODES).toBe(MODES);
    expect(entry.isTheme).toBe(isTheme);
    expect(entry.isMode).toBe(isMode);
  });
});
