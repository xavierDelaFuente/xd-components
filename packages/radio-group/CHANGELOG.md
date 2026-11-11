# @asnewyla/radio-group

## 0.2.2

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
- Updated dependencies [fcc4718]
  - @asnewyla/radio@0.2.2

## 0.2.1

### Patch Changes

- Updated dependencies [b02fc0d]
  - @asnewyla/radio@0.2.1

## 0.2.0

### Minor Changes

- ed741b3: create @asnewyla/radio-group, a role="radiogroup" wrapper that owns which value is selected (controlled or uncontrolled) and shares it with member Radios via context, fixing the sibling data-checked desync that affects several independent, uncontrolled Radios sharing a native name

### Patch Changes

- Updated dependencies [06eeea3]
  - @asnewyla/radio@0.2.0
