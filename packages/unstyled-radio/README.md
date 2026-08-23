# @asnewyla/unstyled-radio

Unstyled, accessible radio input primitive. Handles checked, focus, and
invalid-state tracking without imposing any visual styling — the base
layer under `@asnewyla/radio`.

## Install

```bash
npm install @asnewyla/unstyled-radio
```

## Usage

```tsx
import { UnstyledRadio } from '@asnewyla/unstyled-radio';

// Uncontrolled — a single radio, or a group sharing a native `name`
<UnstyledRadio aria-label="Option A" name="choice" defaultChecked />
<UnstyledRadio aria-label="Option B" name="choice" />

// Controlled
<UnstyledRadio
  aria-label="Option A"
  checked={selected === 'a'}
  onChange={() => setSelected('a')}
/>

// Invalid state
<UnstyledRadio aria-label="Option A" invalid />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `checked` / `defaultChecked` | `boolean` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

Uncontrolled by default, same as a native `<input type="radio">` — pass
`checked` + `onChange` to control it yourself.

State is exposed via `data-checked`, `data-focused`, `data-disabled`, and
`data-invalid`/`aria-invalid` — style off these attributes rather than
`:checked`, for the same DevTools-visible, test-stable reasons every other
`@asnewyla/*` primitive uses `data-*` for state.

### A real multi-radio group needs `RadioGroup`, not several bare `UnstyledRadio`s

Two `UnstyledRadio`s sharing a native `name` get correct browser-level
exclusivity for free — clicking one genuinely unchecks the other at the
DOM level, no JavaScript required. But each `UnstyledRadio` only learns
about its **own** checked state through its **own** `onChange`; browsers
never fire a `change` event on a radio that gets deselected as a side
effect of a sibling being selected. That means `data-checked` on the
deselected radio goes stale — the underlying `<input>` really is
unchecked, but the attribute you'd style off doesn't know it yet.

For a real, visually-correct multi-radio group, use `RadioGroup` (a
shared source of truth for which value is selected) rather than several
independent, uncontrolled `UnstyledRadio`s. `UnstyledRadio` on its own is
reliable for a single isolated radio, or for any usage where you fully
control `checked` yourself.

## License

MIT
