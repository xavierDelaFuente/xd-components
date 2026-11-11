# @asnewyla/button

## 0.3.0

### Minor Changes

- 89225c4: Add `variant="outline"`: a low-emphasis button with no fill, the theme text colour and a `--xd-color-border-strong` frame at the theme's `--xd-frame-border-width`. Hover and active fill from `--xd-color-surface-hover`. Uses existing tokens only. The border meets 3:1 and the label 4.5:1 against the surface in every theme and mode.

### Patch Changes

- fcc4718: Ship `'use client';` as the first statement of the built JS (ESM and CJS), so these components can be imported directly from a React Server Component (e.g. a Next.js App Router page) with no app-side `'use client'` re-export. Server-safe packages (`tokens`, `layout`, `card`, `table`, `spinner`, `button-group`, `icon-button`, `tabs`, `tooltip`, `dialog`) stay without the directive; their client boundary is the package they import.
- Updated dependencies [fcc4718]
  - @asnewyla/unstyled-button@0.2.1

## 0.2.1

### Patch Changes

- b02fc0d: read the new token tiers `@asnewyla/tokens` added for the theme system — no visual change with the default token set, since every new token's fallback matches current behavior:
  
  - `Button`: `border` now reads `--xd-control-border-width`/`--xd-control-border-color` (0/currentColor by default — themes like Block/Terminal can now give filled buttons a real outline), gains a themeable press effect via `--xd-shadow-control`/`--xd-shadow-control-active`/`--xd-press-transform` (all `none` by default), reads `--xd-control-height-md` at the `md` size, and its own label text reads `--xd-letter-spacing-label`/`--xd-text-transform-label`.
  - `Card`'s border and `Select`'s popup border now read `--xd-frame-border-width` instead of the plain hairline token, so a theme can thicken frame surfaces independently of every other hairline.
  - `Select`'s trigger now reads `--xd-control-height-md` instead of a hardcoded height, matching `Button`.
  - `Select`, `Input`, `Checkbox`, and `Radio`'s `-label` elements all read `--xd-letter-spacing-label`/`--xd-text-transform-label` now, matching `Button`.
  - `Input`'s field also reads `--xd-control-height-md`, matching `Select`'s trigger and `Button`'s `md` size.

## 0.2.0

### Minor Changes

- daaf01f: add input component. update tokens to be responsive when possible
- 0286503: create a css tokens package and consume it in button package

### Patch Changes

- Updated dependencies [6adc3c6]
  - @asnewyla/unstyled-button@0.2.0
