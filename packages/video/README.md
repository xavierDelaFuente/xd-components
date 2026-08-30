# @asnewyla/video

A thin styled wrapper over the native `<video>` element — aspect ratio,
object-fit, token-based rounding, and a load-error fallback. Uses the
browser's own controls; no custom play/scrub/volume UI.

## Install

```bash
npm install @asnewyla/video
```

## Usage

```tsx
import { Video } from '@asnewyla/video';

<Video src="/intro.mp4" poster="/intro-poster.jpg" controls />

<Video
  src="/hero.mp4"
  aspectRatio="16 / 9"
  radius="lg"
  autoPlay
  loop
  muted
  playsInline
/>

// Captions come through as a native <track> child — there is no captions prop
<Video src="/talk.mp4" controls>
  <track kind="captions" srcLang="en" label="English" src="/talk.en.vtt" default />
</Video>
```

### Props

| Prop | Type | Default |
|---|---|---|
| `src` | `string` | — |
| `aspectRatio` | `string` (any CSS `aspect-ratio` value, e.g. `"16 / 9"`) | — |
| `fit` | `'cover' \| 'contain' \| 'fill' \| 'none' \| 'scale-down'` | `'cover'` |
| `radius` | `'sm' \| 'md' \| 'lg' \| 'full'` | none (square corners) |
| `fallback` | `string` (src to swap to if `src` fails to load) | — |

All other native `<video>` attributes — `controls`, `autoPlay`, `loop`,
`muted`, `poster`, `preload`, `playsInline`, `crossOrigin`, `width`,
`height`, event handlers — pass straight through. Children render as the
element's native fallback content (shown when the browser can't play the
source) and are where `<track>` elements go.

`fit` only has a visible effect once the box is constrained — set `width`
and `height`, or an `aspectRatio`.

If `fallback` also fails to load, `Video` stops swapping — it doesn't loop.
If `src` changes to a new value later, the fallback state resets and the new
`src` gets its own attempt.

### Accessibility

The native `<video controls>` UI is keyboard operable and labelled by the
browser. For any clip with dialogue, supply a `<track kind="captions">`
child — WCAG 1.2.2. Give a decorative/ambient background clip an
`aria-label` or `aria-hidden` as appropriate.

### Theming

`radius` reads from `@asnewyla/tokens` the same way `@asnewyla/image` does —
optional import, works standalone with built-in fallbacks:

```ts
import '@asnewyla/tokens/tokens.css';
```

You must also import the component's own stylesheet:

```ts
import '@asnewyla/video/styles.css';
```

## License

MIT
