# @asnewyla/unstyled-dialog

Unstyled, accessible modal dialog primitive built on the native `<dialog>`
element. Compound components, no visual styling — the base layer under
`@asnewyla/dialog`.

## Install

```bash
npm install @asnewyla/unstyled-dialog
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
} from '@asnewyla/unstyled-dialog';

<Dialog>
  <DialogTrigger>Delete file</DialogTrigger>
  <DialogContent>
    <DialogTitle>Delete file</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
    <DialogClose>Cancel</DialogClose>
    <DialogClose onClick={handleDelete}>Delete</DialogClose>
  </DialogContent>
</Dialog>

// Controlled
<Dialog open={open} onOpenChange={setOpen}>
  ...
</Dialog>
```

### Components

| Component | Renders | Notes |
|---|---|---|
| `Dialog` | nothing (provider only) | owns open state (`open`/`defaultOpen`/`onOpenChange`); no wrapper element, since `DialogContent`'s native `<dialog>` sits in the browser's top layer regardless of where this is in the tree |
| `DialogTrigger` | `<button type="button">` | `aria-haspopup="dialog"`, `aria-expanded`, opens the dialog on click |
| `DialogContent` | `<dialog>` | driven by `showModal()`/`close()`; `data-state="open"\|"closed"`; closes on the native `close` event (Escape) and on a backdrop click |
| `DialogTitle` | `<h2>` | wires `aria-labelledby` on `DialogContent` automatically, only while rendered |
| `DialogDescription` | `<p>` | wires `aria-describedby` on `DialogContent` automatically, only while rendered |
| `DialogClose` | `<button type="button">` | closes the dialog on click |

### Why native `<dialog>`

Focus trap, keyboard-Escape-to-close, background inertness, top-layer
stacking, and the `::backdrop` pseudo-element all come from the browser for
free — this primitive doesn't reimplement any of them. `DialogTitle` and
`DialogDescription` are optional; render either, both, or neither, and
`DialogContent`'s `aria-labelledby`/`aria-describedby` track what's actually
present.

### Not yet supported

- **Focus trap / restoration testing.** These are native `<dialog>` behavior — verified by hand in Storybook, not by a jsdom test (jsdom has no working `<dialog>` implementation to test against; see the package's `test-setup.ts`).
- **`AlertDialog` preset.** Pass `role="alertdialog"` to `DialogContent` directly today; a dedicated preset (required labelled actions, focus defaults to the safe action) waits for a real consumer need.
- **Nested dialogs.** Untested; native `<dialog>` supports stacking, but this primitive hasn't been exercised with more than one open at a time.

## License

MIT
