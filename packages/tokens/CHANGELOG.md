# @asnewyla/tokens

## 0.5.0

### Minor Changes

- b02fc0d: replace the unreleased `theme-paper`/`theme-sand`/`theme-lavender` themes with six complete themes — `theme-terra`, `theme-almanac`, `theme-block`, `theme-graphite`, `theme-rubber`, `theme-terminal` — each a full, standalone set of every `--xd-*` token (including the new tiers below), plus `background-color`/`color`/`font-family` painted directly on `[data-theme="name"]` so a page mounting only a theme file still renders correctly with nothing else styled. Unlike the retired themes, a theme file no longer combines a bare `:root:not([data-theme])` fallback into its own selector — `tokens.css`'s own `:root` is the sole untagged default now.
  
  Also, on `tokens.css` itself: adds a font-family tier (`--xd-font-family`, `--xd-font-family-mono`, `--xd-font-weight-medium`, `--xd-font-weight-bold`), label voicing (`--xd-letter-spacing-label`, `--xd-text-transform-label`), `--xd-space-3xl`, a second border tier (`--xd-border-width-thick`), `--xd-frame-border-width` (what cards/popovers/listboxes read), a control border pair (`--xd-control-border-width`/`--xd-control-border-color`, off by default), `--xd-control-height-md`, and a control-specific elevation tier separate from surface elevation (`--xd-shadow-control`, `--xd-shadow-control-active`, `--xd-press-transform`) for a themeable button press effect. Also fixes `tokens.css`'s own dark-mode media query to respect an explicit `data-mode="light"` override, matching what the theme files already did. Paints `background-color`/`color`/`font-family` on the bare `:root` too, so a lone `<ThemeProvider>` with nothing else mounted still renders themed rather than transparent.

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
