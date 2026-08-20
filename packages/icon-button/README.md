# @xd/icon-button

Icon-only button, composed from `@xd/button`. Requires a `label` for
accessibility — there's no visible text, so `aria-label` carries the
accessible name and the icon itself is hidden from assistive tech.

## Install

```bash
npm install @xd/icon-button
```

Requires `@xd/button`'s stylesheet:

```ts
import '@xd/button/styles.css';
```

## Usage

```tsx
import { IconButton } from '@xd/icon-button';

<IconButton icon={<SaveIcon />} label="Save file" />
<IconButton icon={<TrashIcon />} label="Delete" variant="destructive" />
```

Accepts every `@xd/button` prop except `children`, `startIcon`, `endIcon`, and
`as` — plus the required `icon` and `label`.

## License

MIT
