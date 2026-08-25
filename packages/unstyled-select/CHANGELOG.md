# @asnewyla/unstyled-select

## 0.2.0

### Minor Changes

- c9dfa95: create @asnewyla/unstyled-select, an unstyled select/combobox primitive with single- and multi-select (enforced via a discriminated union on `multiple`), full WAI-ARIA listbox keyboard navigation (Arrow/Home/End/Enter/Escape, roving focus, disabled-option skipping), client-side search/filter of options via a search input rendered inside the popup, click-outside/Escape-to-close, a `renderValue` render prop (with a `removeOption` helper) for custom trigger content like removable multi-select chips — the trigger is a `<div role="combobox">` rather than a `<button>` so it can host that kind of interactive content — and an `invalid` prop matching every other input-shaped primitive in this library, exposing state via data-* attributes
