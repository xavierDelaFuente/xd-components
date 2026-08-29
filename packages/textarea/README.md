# @asnewyla/textarea

Styled multi-line text input built on `@asnewyla/unstyled-textarea`. Label
association, inline validation error, and full keyboard/focus
accessibility.

## Install

```bash
npm install @asnewyla/textarea
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/textarea/styles.css';
```

## Usage

```tsx
import { Textarea } from '@asnewyla/textarea';

<Textarea label="Bio" placeholder="Tell us about yourself" />

<Textarea label="Bio" error="Bio is required" />

// Controlled
<Textarea
  label="Bio"
  value={bio}
  onChange={(e) => setBio(e.target.value)}
/>

// Any native textarea attribute passes straight through
<Textarea label="Cover letter" rows={10} />
```

### Props

Everything `@asnewyla/unstyled-textarea` accepts, plus:

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop, same convention as `@asnewyla/input`/`@asnewyla/checkbox`/
`@asnewyla/switch`. Setting `error` sets `aria-invalid`/`data-invalid` on
the field and links it via `aria-describedby` to the rendered error
message.

Resizing is vertical-only (`resize: vertical`), not the browser's default
`both` — letting a stacked, block-level field grow wider than its
container breaks whatever layout it sits in.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-border: #cbd5e1;
  --xd-color-destructive: #dc2626;
}
```

## License

MIT
