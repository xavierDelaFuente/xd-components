import { defineConfig, type Options } from 'tsup';

const shared: Options = {
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  external: ['react', 'react-dom'],
};

export default defineConfig([
  {
    ...shared,
    entry: ['src/index.ts'],
    // No `treeshake`: its Rollup pass strips the banner. esbuild still tree-shakes.
    banner: { js: "'use client';" },
    clean: ['index.*'],
  },
  {
    // No banner: server code must get the real values, not client references.
    ...shared,
    entry: ['src/constants.ts'],
    clean: ['constants.*'],
  },
]);
