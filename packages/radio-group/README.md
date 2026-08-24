# @asnewyla/radio-group

Groups `@asnewyla/radio`'s `Radio` into a `role="radiogroup"`, owning which
value is currently selected (controlled or uncontrolled) as one shared
source of truth.

## Install

```bash
npm install @asnewyla/radio-group
```

## Usage

```tsx
import { RadioGroup } from '@asnewyla/radio-group';
import { Radio } from '@asnewyla/radio';

// Uncontrolled
<RadioGroup name="size" defaultValue="md">
  <Radio label="Small" value="sm" />
  <Radio label="Medium" value="md" />
  <Radio label="Large" value="lg" />
</RadioGroup>

// Controlled
<RadioGroup name="size" value={size} onChange={setSize}>
  <Radio label="Small" value="sm" />
  <Radio label="Medium" value="md" />
  <Radio label="Large" value="lg" />
</RadioGroup>
```

Member `Radio`s don't need their own `checked`/`onChange`/`name` — they
read `checked` from the group's selected value (comparing it against
their own `value`), route selection through the group's `onChange`, and
inherit `name` automatically. A `Radio`'s own explicit `checked` prop
still takes precedence if you pass one anyway, matching how `Button`
resolves props against `ButtonGroupContext`.

### Props

| Prop | Type | Default |
|---|---|---|
| `name` | `string` (**required**) | — |
| `value` / `defaultValue` | `string` | — |
| `onChange` | `(value: string) => void` | — |
| `children` | `React.ReactNode` (**required**) | — |

Every other native `<div>` prop (`aria-label`, `className`, ...) is
accepted and forwarded to the `role="radiogroup"` root element.

## Why this exists

Two `Radio`s sharing a native `name` already get correct browser-level
exclusivity for free — clicking one genuinely unchecks the other at the
DOM level, no JavaScript required. But each one only learns about its
*own* checked state through its *own* `change` event; browsers never fire
one on a radio that gets deselected as a side effect of a sibling being
selected. Without `RadioGroup`, that means the deselected radio's visual
state (driven by `data-checked`, not `:checked`) can go stale even though
the underlying `<input>` really is unchecked.

`RadioGroup` fixes this by being the single owner of "which value is
selected" — every member `Radio` reads its `checked` state from the same
context value on every render, so there's no per-radio state to fall out
of sync in the first place. See `@asnewyla/unstyled-radio`'s README for
the underlying limitation this exists to fix, and how to reproduce it
without `RadioGroup`.

## License

MIT
