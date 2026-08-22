# @asnewyla/card

Content card surface with an optional full-bleed image, padding, and radius.

## Install

```bash
npm install @asnewyla/card @asnewyla/image
```

`Card` renders `@asnewyla/image`'s `Image` internally for its optional `image`
slot, so that stylesheet also needs importing once, alongside `Card`'s own:

```ts
import '@asnewyla/card/styles.css';
import '@asnewyla/image/styles.css';
```

## Usage

```tsx
import { Card } from '@asnewyla/card';

<Card>
  <h3>Card title</h3>
  <p>Some supporting body text.</p>
</Card>

<Card
  radius="md"
  image={{ src: '/photo.jpg', alt: 'A mountain at sunset', aspectRatio: '2 / 1' }}
>
  <h3>Mountain view</h3>
  <p>The image renders full-bleed above the content, clipped to the card's own radius.</p>
</Card>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `children` | `React.ReactNode` (**required**) | — |
| `image` | `Omit<ImageProps, 'radius'>` | — |
| `padding` | `'sm' \| 'md' \| 'lg'` | `'md'` |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | — (square corners) |

Every other native `<div>` prop (`className`, `style`, `id`, `aria-*`, ...) is
accepted and forwarded to the root element; a `className` you pass is merged
with the card's own, not replaced.

`image` accepts everything `Image` itself does — `src`, `alt`, `fit`,
`aspectRatio`, `fallback`, native `<img>` attributes — except `radius`:
the card's own `radius` already governs the image's corners (it's rendered
edge-to-edge and clipped to the card's shape), so a separate image radius
would just be a way to fight it.

### Theming

Override the CSS custom properties — defaults adapt automatically to
`prefers-color-scheme` via `@asnewyla/tokens`:

```css
:root {
  --xd-color-border: #cbd5e1;
  --xd-radius-md: 0.375rem;
  --xd-space-md: 0.5rem;
}
```

## License

MIT
