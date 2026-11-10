---
"@asnewyla/toggle-group": minor
---

Add `@asnewyla/toggle-group`: `ToggleGroup` / `ToggleGroupItem`, a choose-one group of real `<button>`s that works inside a plain `<form>`. The group is a `role="group"` that requires `aria-label` or `aria-labelledby` at the type level, and passes `name`, `size` (`sm`/`md`/`lg`) and `disabled` to its items. Items are `@asnewyla/button` buttons that accept native props (`type`, `value`, `formAction`, ...), so a `type="submit"` item sends `name=value`. The pressed item gets `aria-pressed="true"` and the `primary` look; the others `aria-pressed="false"` and `outline`. Single-select, with no deselect: uncontrolled (`defaultValue`), controlled (`value` + `onValueChange`), or server-driven (`value` alone, which clicks never move). Ships `styles.css`: a wrapping row, with a `gap` prop (`sm`/`md`/`lg`, default `sm`) on the same token scale as `ButtonGroup` and `Stack`/`Group`.
