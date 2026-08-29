# @asnewyla/unstyled-textarea

Unstyled, accessible multi-line text input (textarea) primitive. Handles
focus and invalid-state tracking without imposing any visual styling — the
base layer under `@asnewyla/textarea`.

## Install

```bash
npm install @asnewyla/unstyled-textarea
```

## Usage

```tsx
import { UnstyledTextarea } from '@asnewyla/unstyled-textarea';

// Uncontrolled
<UnstyledTextarea aria-label="Bio" defaultValue="" />

// Controlled
<UnstyledTextarea
  aria-label="Bio"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>

// Invalid state
<UnstyledTextarea aria-label="Bio" invalid />

// Any native textarea attribute passes straight through
<UnstyledTextarea aria-label="Bio" rows={6} placeholder="Tell us about yourself" />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `value` / `defaultValue` | `string` | — |
| `onChange` | `(event: React.ChangeEvent<HTMLTextAreaElement>) => void` | — |
| `disabled` | `boolean` | `false` |
| `invalid` | `boolean` | `false` |

Uncontrolled by default, same as a native `<textarea>` — pass `value` +
`onChange` to control it yourself. No internal value tracking beyond
that — text content is visually self-evident, the same reasoning
`@asnewyla/unstyled-input` uses.

Resizing is plain native `<textarea>` behavior (`rows`, `resize` via CSS,
the browser's own resize handle) — no auto-grow-to-content built in.

State is exposed via `data-focused`, `data-disabled`, and
`data-invalid`/`aria-invalid` — style off these attributes in
`@asnewyla/textarea` (or your own styled wrapper), same `data-*`
convention every `@asnewyla/*` primitive uses. No explicit `role` is set;
a native `<textarea>` already carries the implicit `textbox` role.

## License

MIT
