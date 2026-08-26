# @asnewyla/input

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
- 8c1144e: add form and formfieldinput components. extend input to work with formfieldContext'

### Patch Changes

- Updated dependencies [f67cbea]
  - @asnewyla/unstyled-input@0.2.0
