import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  // No `treeshake`: its Rollup pass strips the banner. esbuild still tree-shakes.
  banner: { js: "'use client';" },
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
});
