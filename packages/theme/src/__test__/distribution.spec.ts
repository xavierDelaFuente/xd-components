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
});
