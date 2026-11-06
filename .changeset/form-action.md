---
"@asnewyla/form": minor
---

`Form` now passes native `<form>` props through (`action`, `method`, `encType`, `aria-*`, ...) and forwards `ref` to the `<form>`. `onSubmit` is optional. Validation still runs first and an invalid submit is always blocked. A valid submit is prevented only when `onSubmit` is given without `action`, so React 19 form actions and plain no-JS forms work through `Form`. `noValidate` defaults to `true` and can be overridden. Existing `onSubmit(values)` usage is unchanged.
