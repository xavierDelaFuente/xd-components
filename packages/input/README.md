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

### Inside a `@asnewyla/form`

`Input` itself has no knowledge of `Form` at all. For any field you want
`Form` to register, validate, and collect on submit, use `FormFieldInput`
from `@asnewyla/form` instead:

```tsx
import { Form, FormFieldInput } from '@asnewyla/form';

<Form onSubmit={(values) => console.log(values)}>
  <FormFieldInput label="Email" name="email" required pattern="^\S+@\S+$" />
  <FormFieldInput label="Password" name="password" required minLength={8} />
  <button type="submit">Submit</button>
</Form>
```

`FormFieldInput` accepts every `Input` prop plus a required `name` and the
validation-rule props (`required`, `pattern`, `minLength`, `maxLength`,
`min`, `max`, `validate`). Used outside a `Form`, it still renders correctly
— `name`/`required`/`pattern`/etc. still reach the native `<input>` as
ordinary HTML attributes — it just has nothing to register with.

A plain `Input` with a `name` placed inside a `Form` is never registered or
validated, but its value is still collected into `onSubmit`'s payload —
`Form` reads submitted values via native `FormData`, which picks up any
named form control regardless of registration. This is intentional, native
`<form>` behavior, not a gap `FormFieldInput` is meant to close.

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
