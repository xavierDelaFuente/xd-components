# @asnewyla/select

Styled select/combobox built on `@asnewyla/unstyled-select`. Label
association, inline validation error, client-side search/filter, and
removable chips for multi-select — full keyboard/focus accessibility.

## Install

```bash
npm install @asnewyla/select
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/select/styles.css';
```

## Usage

```tsx
import { Select } from '@asnewyla/select';

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry', disabled: true },
];

<Select
  label="Fruit"
  options={fruitOptions}
  placeholder="Choose a fruit"
/>

<Select
  label="Fruit"
  options={fruitOptions}
  error="Pick a fruit to continue"
/>

// Controlled
<Select
  label="Fruit"
  options={fruitOptions}
  value={selected}
  onChange={setSelected}
/>

// Multi-select — selected options render as removable chips
<Select
  label="Fruit"
  options={fruitOptions}
  multiple
  defaultValue={['apple', 'banana']}
  onChange={(values) => console.log(values)}
/>
```

### Props

Everything `@asnewyla/unstyled-select` accepts, plus:

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop, and `renderValue` isn't exposed either (its multi-select chip
rendering is what this package provides). Setting `error` sets
`aria-invalid`/`data-invalid` on the trigger and links it via
`aria-describedby` to the rendered error message. Same convention
`@asnewyla/input` and `@asnewyla/checkbox` use.

### Multi-select chips

Each selected option renders as a chip with its own remove button
(`aria-label="Remove <label>"`). Removing a chip calls `onChange` with
that option deselected — the same toggle clicking it again in the listbox
would trigger. The listbox is still there for adding more options; chips
are just an alternate way to see and remove what's already selected.

Single-select shows the selected label as plain text, unchanged from
`@asnewyla/unstyled-select`'s own default — chips are a multi-select-only
affordance.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-destructive: #dc2626;
  --xd-color-surface: #ffffff;
}
```

### Not yet supported

Inherits `@asnewyla/unstyled-select`'s own limitations — see its README:
no native `FormData` form participation, and the listbox popup renders
inline (no portal), so it can be visually clipped by an `overflow: hidden`
or scrolling ancestor.

## License

MIT
