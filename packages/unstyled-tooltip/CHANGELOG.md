# @asnewyla/unstyled-tooltip

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- 34e7130: Add `@asnewyla/unstyled-tooltip`, an unstyled tooltip primitive — compound components (`Tooltip`/`TooltipTrigger`/`TooltipContent`), `TooltipTrigger` clones its single child, hover-open with a configurable delay, immediate open on keyboard focus, and Escape/blur/leave/press to dismiss. `aria-describedby` is wired to the content while open. CSS-only positioning via `side` → `data-side`; no portal, no collision detection.
