# @asnewyla/form

## 0.3.0

### Minor Changes

- 1cd6453: `Form` now passes native `<form>` props through (`action`, `method`, `encType`, `aria-*`, ...) and forwards `ref` to the `<form>`. `onSubmit` is optional. Validation still runs first and an invalid submit is always blocked. A valid submit is prevented only when `onSubmit` is given without `action`, so React 19 form actions and plain no-JS forms work through `Form`. `noValidate` defaults to `true` and can be overridden. Existing `onSubmit(values)` usage is unchanged.

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
- Updated dependencies [fcc4718]
  - @asnewyla/input@0.2.2

## 0.2.2

### Patch Changes

- Updated dependencies [b02fc0d]
  - @asnewyla/input@0.2.1

## 0.2.1

### Patch Changes

- 07f7f66: add missing styles for the error summary (role="alert" box, heading, links) and export them via ./styles.css

## 0.2.0

### Minor Changes

- 8c1144e: add form and formfieldinput components. extend input to work with formfieldContext'

### Patch Changes

- Updated dependencies [daaf01f]
- Updated dependencies [8c1144e]
  - @asnewyla/input@0.2.0
