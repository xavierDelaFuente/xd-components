# @asnewyla/unstyled-input

Unstyled, accessible text input primitive. Handles focus and invalid-state
tracking without imposing any visual styling — the base layer under
`@asnewyla/input`.

## Install

```bash
npm install @asnewyla/unstyled-input
```

## Usage

```tsx
import { UnstyledInput } from '@asnewyla/unstyled-input';

// Uncontrolled
<UnstyledInput aria-label="Name" defaultValue="" />

// Controlled
<UnstyledInput aria-label="Name" value={name} onChange={(e) => setName(e.target.value)} />

// Invalid state
<UnstyledInput aria-label="Email" invalid />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `value` / `defaultValue` | `string` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLInputElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

Uncontrolled by default, same as a native `<input>` — pass `value` +
`onChange` to control it yourself.

## License

MIT
