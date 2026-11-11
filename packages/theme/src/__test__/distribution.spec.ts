import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const read = (path: string) =>
  readFileSync(resolve(__dirname, '../..', path), 'utf-8');

// Reads dist/, so it needs `pnpm build` first (CI builds before testing).
describe('distribution', () => {
  it.each(['dist/index.mjs', 'dist/index.js'])(
    "%s starts with the 'use client' directive",
    (file) => {
      expect(read(file).startsWith("'use client';")).toBe(true);
    },
  );

  // A server component that imports a value from a 'use client' module gets
  // a client reference, not the value, so `THEMES.includes(...)` would break
  // there. The constants entry must stay a plain module.
  it.each(['dist/constants.mjs', 'dist/constants.js'])(
    "%s has no 'use client' directive, so server code gets the real values",
    (file) => {
      expect(read(file)).not.toMatch(/['"]use client['"]/);
    },
  );

  it('exports ./constants from package.json', () => {
    const pkg = JSON.parse(read('package.json'));
    expect(pkg.exports['./constants']).toEqual({
      types: './dist/constants.d.ts',
      import: './dist/constants.mjs',
      require: './dist/constants.js',
    });
  });
});
