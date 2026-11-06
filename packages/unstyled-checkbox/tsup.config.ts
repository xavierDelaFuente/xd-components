import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/test-utils.ts'],
  format: ['esm', 'cjs'],
  // No `treeshake`: its Rollup pass strips the banner. esbuild still tree-shakes.
  banner: { js: "'use client';" },
  dts: true,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@testing-library/react',
    '@testing-library/user-event',
  ],
});
