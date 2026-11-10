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
    "%s has no 'use client' directive, so it stays server-safe",
    (file) => {
      expect(read(file)).not.toMatch(/['"]use client['"]/);
    },
  );
});
