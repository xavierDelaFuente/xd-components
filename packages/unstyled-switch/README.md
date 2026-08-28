# @asnewyla/unstyled-switch

Unstyled, accessible switch (toggle) input primitive. A real
`<input type="checkbox">` under a `role="switch"` override — handles
checked state, focus, and invalid-state tracking without imposing any
visual styling — the base layer under `@asnewyla/switch`.

## Install

```bash
npm install @asnewyla/unstyled-switch
```

## Usage

```tsx
import { UnstyledSwitch } from '@asnewyla/unstyled-switch';

// Uncontrolled
<UnstyledSwitch aria-label="Notifications" defaultChecked={false} />

// Controlled
<UnstyledSwitch
  aria-label="Notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>

// Invalid state
<UnstyledSwitch aria-label="Notifications" invalid />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

Uncontrolled by default, same as a native `<input type="checkbox">` — pass
`checked` + `onChange` to control it yourself. No `indeterminate` — that's
a checkbox concept, not a switch one; a switch is always fully on or off.

### Why a checkbox, not a custom widget

Renders `<input type="checkbox" role="switch">` — the standard WAI-ARIA
switch pattern, not a hand-rolled `<div role="switch">`. This gets native
keyboard activation (Space toggles), native form participation, and
correct browser/screen-reader behavior for free, with `role="switch"` as
the only thing distinguishing it from `@asnewyla/unstyled-checkbox`
visually and semantically to assistive tech ("on/off" announced instead
of "checked/unchecked").

### Accessibility

State is exposed two ways, deliberately asymmetric:

- `data-checked` (and `data-focused`/`data-disabled`/`data-invalid`) —
  present only when true, omitted otherwise. The styling hook for
  `@asnewyla/switch` (or your own styled wrapper), same `data-*`
  convention every `@asnewyla/*` primitive uses.
- `aria-checked` — always present as an explicit `"true"`/`"false"`
  string, never omitted. This is what actually conveys state to
  assistive tech once `role="switch"` overrides the input's native
  semantics; a real browser computes this from the native `checked`
  property on its own, but setting it explicitly here is cheap insurance
  rather than relying on that alone.

`aria-invalid`/`data-invalid` follow the same pattern as every other
`@asnewyla/*` primitive.

## License

MIT
