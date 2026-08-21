# @asnewyla/image

Image display with org styling — aspect ratio, object-fit, token-based
rounding, and a load-error fallback.

## Install

```bash
npm install @asnewyla/image
```

## Usage

```tsx
import { Image } from '@asnewyla/image';

<Image src="/hero.jpg" alt="Team at the launch event" />

<Image
  src="/avatar.png"
  alt="Jordan's profile picture"
  aspectRatio="1 / 1"
  radius="full"
  fallback="/default-avatar.png"
/>

// Decorative image — alt is still required, pass an empty string explicitly
<Image src="/divider.svg" alt="" />
```

### Props

| Prop | Type | Default |
|---|---|---|
| `src` | `string` | — |
| `alt` | `string` (**required**) | — |
| `aspectRatio` | `string` (any CSS `aspect-ratio` value, e.g. `"16 / 9"`) | — |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | none (square corners) |
| `fallback` | `string` (src to swap to if `src` fails to load) | — |

`alt` has no default and isn't optional — TypeScript forces you to decide.
For a genuinely decorative image, pass `alt=""` explicitly rather than
omitting it.

If `fallback` also fails to load, `Image` stops swapping — it doesn't loop.
If `src` changes to a new value later, the fallback state resets and the new
`src` gets its own attempt.

### Theming

`radius` reads from `@asnewyla/tokens` the same way `@asnewyla/button` does —
optional import, works standalone with built-in fallbacks:

```ts
import '@asnewyla/tokens/tokens.css';
```

## License

MIT
