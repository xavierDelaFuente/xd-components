# @asnewyla/checkbox

Styled checkbox built on `@asnewyla/unstyled-checkbox`. Label association,
inline validation error, indeterminate state, full keyboard/focus
accessibility.

## Install

```bash
npm install @asnewyla/checkbox
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/checkbox/styles.css';
```

## Usage

```tsx
import { Checkbox } from '@asnewyla/checkbox';

<Checkbox label="Accept terms" />

<Checkbox
  label="Accept terms"
  error="You must accept the terms to continue"
/>

// Controlled
<Checkbox
  label="Accept terms"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Indeterminate ("select all" style)
<Checkbox label="Select all" indeterminate />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |
| `checked` / `defaultChecked` | `boolean` | — |
| `indeterminate` | `boolean` | `false` |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `id` | `string` | auto-generated via `useId()` |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop. Setting `error` sets `aria-invalid` on the input and links it via
`aria-describedby` to the rendered error message; there's no way to end up
with one without the other. Same convention `@asnewyla/input` uses.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-destructive: #dc2626;
}
```

## License

MIT
