# @asnewyla/unstyled-table

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- 38f3689: Add "First page"/"Last page" pagination buttons alongside Previous/Next, and a `data-pagination-action` attribute on all four pagination buttons for styling hooks. `@asnewyla/table` now renders them as CSS-drawn icon chevrons instead of text.
- f65a4b8: Add `@asnewyla/unstyled-table`, an unstyled table primitive with plain rendering, single-column sorting, client-side global search filtering, row selection, and pagination.
