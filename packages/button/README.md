# @asnewyla/button

Styled button component built on `@asnewyla/unstyled-button`. Variants, sizes, icon
slots, full keyboard/focus accessibility.

## Install

```bash
npm install @asnewyla/button
```

Import the stylesheet once, anywhere in your app:

```ts
import '@asnewyla/button/styles.css';
```

## Usage

```tsx
import { Button } from '@asnewyla/button';

<Button variant="primary" size="md">Save changes</Button>
<Button variant="destructive" onClick={handleDelete}>Delete</Button>
<Button as="a" href="/profile">Go to profile</Button>
<Button startIcon={<SaveIcon />}>Save</Button>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'destructive'` | `'primary'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `disabled` | `boolean` | `false` |
| `startIcon` / `endIcon` | `ReactNode` | — |
| `as` | `ElementType` | `'button'` |

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme`:

```css
:root {
  --xd-color-primary: #0d9488;
  --xd-color-secondary: #64748b;
  --xd-color-destructive: #dc2626;
  --xd-color-focus: #0d9488;
}
```

### Inside a `@asnewyla/button-group`

`variant`, `size`, and `disabled` are inherited from an ancestor `ButtonGroup`
when not set explicitly — see `@asnewyla/button-group`.

## License

MIT
