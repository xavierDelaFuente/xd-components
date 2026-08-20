# @asnewyla/icon-button

Icon-only button, composed from `@asnewyla/button`. Requires a `label` for
accessibility — there's no visible text, so `aria-label` carries the
accessible name and the icon itself is hidden from assistive tech.

## Install

```bash
npm install @asnewyla/icon-button
```

Requires `@asnewyla/button`'s stylesheet:

```ts
import '@asnewyla/button/styles.css';
```

## Usage

```tsx
import { IconButton } from '@asnewyla/icon-button';

<IconButton icon={<SaveIcon />} label="Save file" />
<IconButton icon={<TrashIcon />} label="Delete" variant="destructive" />
```

Accepts every `@asnewyla/button` prop except `children`, `startIcon`, `endIcon`, and
`as` — plus the required `icon` and `label`.

## License

MIT
