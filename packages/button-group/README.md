# @asnewyla/button-group

Groups `@asnewyla/button` components visually (`role="group"`) and propagates
`variant`, `size`, and `disabled` to every child via context. Any child can
override an individual prop.

## Install

```bash
npm install @asnewyla/button-group
```

## Usage

```tsx
import '@asnewyla/button/styles.css';
import '@asnewyla/button-group/styles.css';
import { Button } from '@asnewyla/button';
import { ButtonGroup } from '@asnewyla/button-group';

<ButtonGroup variant="secondary" aria-label="Text alignment">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button variant="destructive">Right</Button> {/* overrides the group */}
</ButtonGroup>
```

### Layout

`styles.css` lays the buttons out in a wrapping row. `gap` sets the space
between them, on the same scale as `Stack`/`Group`. Without the stylesheet,
the buttons render inline with no gap. `className` is merged with the
`xd-button-group` class.

```tsx
<ButtonGroup gap="md" aria-label="Actions">…</ButtonGroup>
```

### Props

Every native `<div>` prop, plus:

| Prop | Type | Default |
|---|---|---|
| `variant` | `ButtonVariant` | — (each button's own) |
| `size` | `'sm' \| 'md' \| 'lg'` | — (each button's own) |
| `disabled` | `boolean` | — |
| `gap` | `'sm' \| 'md' \| 'lg'` (`--xd-space-sm/md/lg`) | `'sm'` |

## License

MIT
