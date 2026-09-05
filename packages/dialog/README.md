# @asnewyla/dialog

Styled modal dialog built on `@asnewyla/unstyled-dialog` — a centered modal
by default, with `left`/`right`/`bottom` sheet positions.

## Install

```bash
npm install @asnewyla/dialog
```

## Usage

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@asnewyla/dialog';
import '@asnewyla/dialog/styles.css';

<Dialog>
  <DialogTrigger>Delete file</DialogTrigger>
  <DialogContent>
    <DialogTitle>Delete file</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
    <DialogClose>Cancel</DialogClose>
    <DialogClose onClick={handleDelete}>Delete</DialogClose>
  </DialogContent>
</Dialog>

// A side sheet instead of a centered modal
<DialogContent position="right">...</DialogContent>
```

Same API as [`@asnewyla/unstyled-dialog`](https://www.npmjs.com/package/@asnewyla/unstyled-dialog),
plus one new prop:

| Prop | Component | Type | Default |
|---|---|---|---|
| `position` | `DialogContent` | `'center' \| 'left' \| 'right' \| 'bottom'` | `'center'` |

`left`/`right` render as a full-height sheet pinned to that edge; `bottom`
renders as a full-width sheet with rounded top corners. `center` relies on
the native `<dialog>`'s own centering.

### Styling

`DialogTrigger`/`DialogClose` get only a plain reset (font, cursor, focus
ring) — no baked-in button look, since they render the actual interactive
element themselves (like `Tabs`' `Tab`, not like `Tooltip`'s cloning
`TooltipTrigger`). Style them with `className`, or pass a `role="alertdialog"`
override on `DialogContent` for a destructive-confirmation dialog without a
dedicated preset.

```ts
import '@asnewyla/tokens/tokens.css'; // optional
import '@asnewyla/dialog/styles.css'; // required
```

## License

MIT
