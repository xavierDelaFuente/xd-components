---
"@asnewyla/tokens": minor
---

add a surface/text token tier (`--xd-color-surface`, `--xd-color-surface-hover`, `--xd-color-text`, `--xd-color-text-muted`) and `--xd-color-border-strong`/`--xd-color-focus`/`--xd-shadow-sm`/`--xd-shadow-md` — needed by any component that owns a floating surface (e.g. `@asnewyla/select`'s popover), which previously had no theme-aware tokens to read and fell back to hardcoded light-mode literals in dark mode; fix `tokens.css`'s dark-mode media query to respect an explicit `data-mode="light"` override, matching the theme files; darken light-mode `--xd-color-primary` (`#0d9488` -> `#0f766e`) and the equivalent `theme-paper`/`theme-sand` primaries to clear WCAG AA (previously 3.74:1 white-on-primary, now 5.47:1+) — also extends `theme-lavender.css` with the same new token tier
