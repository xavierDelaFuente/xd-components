---
"@asnewyla/toggle-group": minor
---

Add `@asnewyla/toggle-group`: `ToggleGroup` / `ToggleGroupItem`, a choose-one group of real `<button>`s that works inside a plain `<form>`. The group is a `role="group"` that requires `aria-label` or `aria-labelledby` at the type level, and passes `name`, `size` (`sm`/`md`/`lg`) and `disabled` to its items. Items are `@asnewyla/button` buttons that accept native props (`type`, `value`, `formAction`, ...), so a `type="submit"` item sends `name=value`. Ships `styles.css`: a wrapping row with a `--xd-space-sm` gap.
