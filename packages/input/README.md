# @asnewyla/input

Styled text input built on `@asnewyla/unstyled-input`. Label association,
inline validation error, full keyboard/focus accessibility.

## Install

```bash
npm install @asnewyla/input
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/input/styles.css';
```

## Usage

```tsx
import { Input } from '@asnewyla/input';

<Input label="Name" placeholder="e.g. Jordan" />

<Input
  label="Email"
  error="Enter a valid email address"
/>

// Controlled
<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |
| `value` / `defaultValue` | `string` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `id` | `string` | auto-generated via `useId()` |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop. Setting `error` sets `aria-invalid` on the input and links it via
`aria-describedby` to the rendered error message; there's no way to end up
with one without the other.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-focus: #0d9488;
  --xd-color-destructive: #dc2626;
}
```

## License

MIT
