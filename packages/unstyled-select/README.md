# @asnewyla/unstyled-select

Unstyled, accessible select/combobox primitive. Supports single- and
multi-select, keyboard navigation, and full ARIA listbox semantics without
imposing any visual styling.

## Install

```bash
npm install @asnewyla/unstyled-select
```

## Usage

```tsx
import { UnstyledSelect } from '@asnewyla/unstyled-select';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
];

// Uncontrolled, single-select
<UnstyledSelect
  aria-label="Fruit"
  options={fruitOptions}
  defaultValue="apple"
  placeholder="Choose a fruit"
/>

// Controlled, single-select
<UnstyledSelect
  aria-label="Fruit"
  options={fruitOptions}
  value={selected}
  onChange={setSelected}
/>

// Multi-select — value/defaultValue/onChange become array-typed
<UnstyledSelect
  aria-label="Fruit"
  options={fruitOptions}
  multiple
  defaultValue={['apple', 'banana']}
  onChange={(values) => console.log(values)}
/>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `options` | `{ value: string; label: string; disabled?: boolean }[]` | — |
| `multiple` | `boolean` | `false` |
| `value` / `defaultValue` | `string` (single) or `string[]` (`multiple`) | — |
| `onChange` | `(value: string) => void` (single) or `(value: string[]) => void` (`multiple`) | — |
| `placeholder` | `string` | — |
| `disabled` | `boolean` | `false` |

`multiple` gates which shape `value`/`defaultValue`/`onChange` accept —
this is enforced at the type level (a discriminated union), not just at
runtime, so passing an array `defaultValue` without `multiple` is a
compile error rather than a silent bug.

Uncontrolled by default: pass `value` + `onChange` to control it yourself.
Single-select closes the listbox and returns focus to the trigger on
selection; multi-select keeps the listbox open so more options can be
toggled.

### Accessibility

Implements the WAI-ARIA listbox pattern: the trigger is `role="combobox"`
with `aria-expanded`/`aria-haspopup`, the popup is `role="listbox"`
(`aria-multiselectable` when `multiple`), and each option is
`role="option"` with `aria-selected`. State is also mirrored via
`data-*` attributes (`data-open`, `data-selected`, `data-disabled`) for
styling and test hooks, same convention as every other `@asnewyla/*`
primitive.

Keyboard support:

| Key | Behavior |
|---|---|
| `Enter` / `Space` on the trigger | Opens the listbox, focusing the selected option (or the first enabled one) |
| `ArrowDown` / `ArrowUp` | Moves focus to the next/previous enabled option, skipping disabled ones, clamped at the ends (no wrap) |
| `Home` / `End` | Jumps to the first/last enabled option |
| `Enter` / `Space` on a focused option | Selects it |
| `Escape` | Closes the listbox and returns focus to the trigger |
| Click outside | Closes the listbox |

### Not yet supported

This primitive is still growing. Not implemented yet:

- **Search/typeahead filtering** — the trigger is a `<button>`, not an
  editable text input.
- **Native form participation** — nothing here submits through
  `FormData` the way `@asnewyla/form`'s `FormFieldInput` expects.
- **Portal rendering** — the listbox renders inline, so it can be
  visually clipped by an `overflow: hidden` or scrolling ancestor.
- An `invalid` prop, unlike every other input-shaped primitive in this
  library.

## License

MIT
