# @asnewyla/unstyled-radio

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- 6c0d9af: create @asnewyla/unstyled-radio, an unstyled radio input primitive with checked/focus/invalid state exposed via data-* attributes, native browser radio-group exclusivity preserved for uncontrolled usage
