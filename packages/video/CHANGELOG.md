# @asnewyla/video

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- 1fbab47: Add `@asnewyla/video`, a thin styled wrapper over the native `<video>` element — `fit`, token-backed `radius`, `aspectRatio`, and a load-error `fallback` src, with native `controls`/`autoPlay`/`loop`/`muted`/`poster`/`preload` and `<track>` children passed straight through. No custom control bar; no primitive/styled split.
