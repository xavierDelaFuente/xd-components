# @asnewyla/theme

## 0.3.0

### Minor Changes

- 828aabf: Add `THEMES`, `MODES`, `isTheme`, `isMode` and the `Theme`/`Mode` types, exported from the new `@asnewyla/theme/constants` entry (built without `'use client'`, so server code such as a Next.js layout gets real values) and re-exported from the main entry. `ThemeProvider`'s `theme` now autocompletes the shipped themes while still accepting any string. README: new "Server rendering / Next.js" section (set `data-theme`/`data-mode` on `<html>` server-side; no `data-mode` follows `prefers-color-scheme`; `ThemeProvider` is for client-only apps and runtime switching).

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- ecaae6d: add @asnewyla/theme's ThemeProvider, which switches the active token set via a data-theme attribute and light/dark via a data-mode attribute, both on the document root, both optional and independent. add paper/sand/lavender theme stylesheets to @asnewyla/tokens, each importable standalone or selectable alongside the others through ThemeProvider
