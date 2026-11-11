# @asnewyla/unstyled-select

## 0.2.1

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.

## 0.2.0

### Minor Changes

- c9dfa95: create @asnewyla/unstyled-select, an unstyled select/combobox primitive with single- and multi-select (enforced via a discriminated union on `multiple`), full WAI-ARIA listbox keyboard navigation (Arrow/Home/End/Enter/Escape, roving focus, disabled-option skipping), client-side search/filter of options via a search input rendered inside the popup, click-outside/Escape-to-close, a `renderValue` render prop (with a `removeOption` helper) for custom trigger content like removable multi-select chips — the trigger is a `<div role="combobox">` rather than a `<button>` so it can host that kind of interactive content — and an `invalid` prop matching every other input-shaped primitive in this library, exposing state via data-* attributes
