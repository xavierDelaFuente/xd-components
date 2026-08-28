# @asnewyla/switch

Styled switch (toggle) built on `@asnewyla/unstyled-switch`. Label
association, inline validation error, and full keyboard/focus
accessibility.

## Install

```bash
npm install @asnewyla/switch
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/switch/styles.css';
```

## Usage

```tsx
import { Switch } from '@asnewyla/switch';

<Switch label="Notifications" />

<Switch
  label="Notifications"
  error="Choose a notification setting to continue"
/>

// Controlled
<Switch
  label="Notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>
```

### Props

Everything `@asnewyla/unstyled-switch` accepts, plus:

| Prop | Type | Default |
|---|---|---|
| `label` | `string` (**required**) | — |
| `error` | `string` | — |

`error` doubles as the invalid-state flag — there's no separate `invalid`
prop, same convention as `@asnewyla/checkbox`/`@asnewyla/radio`/
`@asnewyla/input`. Setting `error` sets `aria-invalid`/`data-invalid` on
the input and links it via `aria-describedby` to the rendered error
message.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-border: #cbd5e1;
  --xd-color-surface: #ffffff;
}
```

## License

MIT
