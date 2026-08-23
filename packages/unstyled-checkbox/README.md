# @asnewyla/unstyled-checkbox

Unstyled, accessible checkbox input primitive. Handles checked/indeterminate
state, focus, and invalid-state tracking without imposing any visual
styling — the base layer under `@asnewyla/checkbox`.

## Install

```bash
npm install @asnewyla/unstyled-checkbox
```

## Usage

```tsx
import { UnstyledCheckbox } from '@asnewyla/unstyled-checkbox';

// Uncontrolled
<UnstyledCheckbox aria-label="Accept terms" defaultChecked={false} />

// Controlled
<UnstyledCheckbox
  aria-label="Accept terms"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Indeterminate ("select all" style)
<UnstyledCheckbox aria-label="Select all" indeterminate />

// Invalid state
<UnstyledCheckbox aria-label="Accept terms" invalid />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | — |
| `indeterminate` | `boolean` | `false` |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

Uncontrolled by default, same as a native `<input type="checkbox">` — pass
`checked` + `onChange` to control it yourself. `indeterminate` is a
DOM-only property with no HTML attribute or plain-JSX-prop equivalent, so
it's applied imperatively via a ref internally; you don't need to do
anything differently as a consumer.

State is exposed via `data-checked`, `data-indeterminate`, `data-focused`,
`data-disabled`, and `data-invalid`/`aria-invalid` — style off these
attributes in `@asnewyla/checkbox` (or your own styled wrapper) rather than
`:checked`/`:indeterminate` pseudo-classes, for the same DevTools-visible,
test-stable reasons every other `@asnewyla/*` primitive uses `data-*` for
state.

## License

MIT
