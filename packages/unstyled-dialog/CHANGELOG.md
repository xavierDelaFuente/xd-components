# @asnewyla/unstyled-dialog

## 0.2.0

### Minor Changes

- ab6579f: Add `@asnewyla/unstyled-dialog`, an unstyled modal dialog primitive built on the native `<dialog>` element — compound components (`Dialog`/`DialogTrigger`/`DialogContent`/`DialogTitle`/`DialogDescription`/`DialogClose`), `showModal()`/`close()` lifecycle, Escape and backdrop-click dismissal, and `aria-labelledby`/`aria-describedby` wired automatically from `DialogTitle`/`DialogDescription` presence. Focus trap, background inertness, and `::backdrop` come from the browser.

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
