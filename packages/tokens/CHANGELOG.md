# @asnewyla/tokens

## 0.4.0

### Minor Changes

- e187c55: add a surface/text token tier (`--xd-color-surface`, `--xd-color-surface-hover`, `--xd-color-text`, `--xd-color-text-muted`) and `--xd-color-border-strong`/`--xd-color-focus`/`--xd-shadow-sm`/`--xd-shadow-md` — needed by any component that owns a floating surface (e.g. `@asnewyla/select`'s popover), which previously had no theme-aware tokens to read and fell back to hardcoded light-mode literals in dark mode; fix `tokens.css`'s dark-mode media query to respect an explicit `data-mode="light"` override, matching the theme files; darken light-mode `--xd-color-primary` (`#0d9488` -> `#0f766e`) and the equivalent `theme-paper`/`theme-sand` primaries to clear WCAG AA (previously 3.74:1 white-on-primary, now 5.47:1+) — also extends `theme-lavender.css` with the same new token tier

## 0.3.0

### Minor Changes

- ecaae6d: add @asnewyla/theme's ThemeProvider, which switches the active token set via a data-theme attribute and light/dark via a data-mode attribute, both on the document root, both optional and independent. add paper/sand/lavender theme stylesheets to @asnewyla/tokens, each importable standalone or selectable alongside the others through ThemeProvider

## 0.2.0

### Minor Changes

- 9c3fd9f: create @asnewyla/image package and add needed tokens to @asnewyla/tokens
- daaf01f: add input component. update tokens to be responsive when possible
- 0286503: create a css tokens package and consume it in button package
