# @asnewyla/select

## 0.2.0

### Minor Changes

- f5d1561: create @asnewyla/select, a styled select/combobox built on `@asnewyla/unstyled-select` — label association, inline validation error (`error` doubles as the invalid flag, same convention as `@asnewyla/input`/`@asnewyla/checkbox`), and removable chips for multi-select via `renderValue`. The popup is absolutely positioned (opening it no longer reflows the page), capped at a max-height with a sticky search field once the list scrolls, and reads `@asnewyla/tokens`' new surface/text/border-strong/focus/shadow tier so it actually repaints for the active theme instead of a hardcoded light-mode fallback.

### Patch Changes

- Updated dependencies [c9dfa95]
  - @asnewyla/unstyled-select@0.2.0
