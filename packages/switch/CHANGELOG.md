# @asnewyla/switch

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
- Updated dependencies [fcc4718]
  - @asnewyla/unstyled-switch@0.2.1

## 0.2.0

### Minor Changes

- 1dd063a: Add `@asnewyla/switch`, a styled switch (toggle) built on `@asnewyla/unstyled-switch` — label, inline validation error, track/thumb CSS.

### Patch Changes

- Updated dependencies [550abdc]
  - @asnewyla/unstyled-switch@0.2.0
