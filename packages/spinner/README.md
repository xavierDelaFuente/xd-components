# @asnewyla/spinner

Accessible loading indicators — an indeterminate `Spinner` and a
content-shaped `Skeleton` placeholder. Non-interactive, no primitive/styled
split (same category as `@asnewyla/image` / `@asnewyla/card`).

## Install

```bash
npm install @asnewyla/spinner
```

```ts
import '@asnewyla/tokens/tokens.css'; // optional — provides the default palette
import '@asnewyla/spinner/styles.css'; // required
```

## Spinner

```tsx
import { Spinner } from '@asnewyla/spinner';

<Spinner />
<Spinner size="lg" label="Loading results" />
```

Renders `<span role="status">` with a visually-hidden label inside the live
region — a screen reader announces the label on mount and it names the
status role (`aria-labelledby`). The rotating ring is `aria-hidden`.

| Prop | Type | Default |
|---|---|---|
| `label` | `string` | `'Loading'` |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` |

Every other native `<span>` prop is forwarded to the root; `role` and
`data-size` cannot be overridden. `children` is not accepted.

## Skeleton

```tsx
import { Skeleton } from '@asnewyla/spinner';

<Skeleton />                              {/* one line of text */}
<Skeleton width={240} height={16} />
<Skeleton width={48} height={48} radius="full" />   {/* avatar */}
<Skeleton width="100%" height="12rem" radius="md" />
```

| Prop | Type | Default |
|---|---|---|
| `width` | `number \| string` | `100%` |
| `height` | `number \| string` | `1em` |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | — (square) |

A `number` is treated as pixels; a string passes straight through. A consumer
`style` is merged over the sizing style. `className`, `data-radius`, `style`,
and `ref` cannot be overridden by `{...rest}`.

`Skeleton` is `aria-hidden` by default — the loading state should be
announced once, by a `Spinner` or an `aria-busy` container, not by every
placeholder box. Pass `aria-hidden={false}` to opt a skeleton back into the
accessibility tree.

```tsx
<div aria-busy="true" aria-live="polite">
  <Skeleton width="60%" />
  <Skeleton />
  <Skeleton width="80%" />
</div>
```

## Reduced motion

Both components respect `prefers-reduced-motion: reduce` — the spinner's
rotation and the skeleton's shimmer sweep are each replaced by a low-frequency
opacity pulse.

## Theming

Override the CSS custom properties — defaults adapt to `prefers-color-scheme`
via `@asnewyla/tokens`:

```css
:root {
  --xd-color-primary: #0f766e;         /* spinner ring */
  --xd-color-surface-hover: #e2e8f0;   /* skeleton base */
  --xd-radius-md: 0.375rem;
}
```

## License

MIT
