# @asnewyla/form

Form wrapper with real client-side validation, an accessible error summary,
and native `<form>` submission semantics.

## Install

```bash
npm install @asnewyla/form @asnewyla/input
```

`FormFieldInput` renders `@asnewyla/input`'s `Input` under the hood, so its
stylesheet also needs importing once, alongside `@asnewyla/form`'s own
(which styles the error summary):

```ts
import '@asnewyla/form/styles.css';
import '@asnewyla/input/styles.css';
```

## Usage

```tsx
import { Form, FormFieldInput } from '@asnewyla/form';

<Form onSubmit={(values) => console.log(values)}>
  <FormFieldInput label="Email" name="email" required pattern="^\S+@\S+$" />
  <FormFieldInput label="Password" name="password" required minLength={8} />
  <button type="submit">Submit</button>
</Form>
```

`Form` validates on blur and on submit, blocks `onSubmit` while any field is
invalid, and reads submitted values via native `FormData` — there's no
duplicated value state to keep in sync.

### `FormFieldInput`

Use `FormFieldInput`, not a plain `Input`, for any field you want `Form` to
register, validate, and collect. It accepts every `Input` prop plus a
required `name` and a small validation-rule vocabulary:

| Prop | Type | Notes |
|---|---|---|
| `name` | `string` (**required**) | Native `name`, also the key in `onSubmit`'s payload |
| `required` | `boolean \| string` | A string overrides the default error message |
| `pattern` | `string` | Regex source text, matching the native `<input pattern>` attribute |
| `minLength` / `maxLength` | `number` | |
| `min` / `max` | `string \| number` | Matching the native `<input min>`/`<input max>` attributes |
| `validate` | `(value: string) => string \| undefined` | Custom sync validator, runs after every other rule passes |

Rules run in that order — `required` → `pattern` → `minLength` → `maxLength`
→ `min` → `max` → `validate` — and the first one that fails wins; only one
error message shows per field.

Used outside a `Form`, `FormFieldInput` still renders correctly — it's a
normal `Input` with no ancestor to register with, and the native attributes
(`required`, `pattern`, etc.) still reach the underlying `<input>`.

A plain `Input` (not `FormFieldInput`) placed inside a `Form` is never
registered or validated, but its value is still collected into `onSubmit`'s
payload if it has a `name` — `Form` reads values via native `FormData`,
which picks up any named form control regardless of registration. This is
intentional, native `<form>` behavior, not a gap `FormFieldInput` needs to
close.

### Error display

Both an inline message and a summary show for an invalid field, not either:

- Each `FormFieldInput` shows its own inline error, linked via
  `aria-describedby` — the same as a plain `Input`.
- `Form` additionally renders an error summary once a submit attempt has
  failed: `role="alert"`, one link per invalid field pointing at that
  field's real `id`, and focus moved to the summary on every failed submit.
  Clicking a link moves focus to the corresponding field. The summary stays
  in sync with corrections made afterward (including via blur) and
  disappears once no errors remain — it doesn't require resubmitting to
  update or go away.

The summary only appears after a submit has actually been attempted — a
field that's invalid purely from blur-driven validation (nobody has tried
to submit yet) shows its own inline error only.

### Form actions and no-JS forms

`Form` passes every native `<form>` prop through (`action`, `method`,
`encType`, `aria-*`, `id`, `className`, ...) and forwards `ref` to the
`<form>` element. Validation runs first on every submit, and an invalid
submit is always blocked. A valid submit goes ahead natively unless you
handle it on the client:

| Props | Valid submit |
|---|---|
| `onSubmit` only | Prevented; `onSubmit(values)` is called (client-only form) |
| `action` (with or without `onSubmit`) | Not prevented: the browser posts, or React 19 runs the action. `onSubmit(values)` is still called if given |
| neither | Not prevented: a plain form posting to its URL |

With a React 19 server action:

```tsx
// actions.ts
'use server';
export async function signIn(formData: FormData) { /* ... */ }
```

```tsx
// page.tsx: a server component, no wrapper needed
import { Button } from '@asnewyla/button';
import { Form, FormFieldInput } from '@asnewyla/form';
import { signIn } from './actions';

<Form action={signIn} aria-label="Sign in">
  <FormFieldInput label="Email" name="email" type="email" required />
  <Button type="submit">Sign in</Button>
</Form>
```

Before JavaScript loads, the browser's own submit is used, so keep
server-side validation. `noValidate` defaults to `true` so `Form`'s
validation and error summary can run. Pass `noValidate={false}` to
turn the browser's native validation UI back on.

### Props

Every native `<form>` prop, plus:

| Prop | Type |
|---|---|
| `children` | `React.ReactNode` (**required**) |
| `onSubmit` | `(values: Record<string, string>) => void` (optional) |
| `noValidate` | `boolean` (default `true`) |
| `ref` | `Ref<HTMLFormElement>` |

## License

MIT
