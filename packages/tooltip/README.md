# @asnewyla/tooltip

Styled tooltip built on `@asnewyla/unstyled-tooltip` — a theme-aware bubble,
CSS positioning per side, no new props over the primitive.

## Install

```bash
npm install @asnewyla/tooltip
```

## Usage

```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from '@asnewyla/tooltip';
import '@asnewyla/tooltip/styles.css';

<Tooltip>
  <TooltipTrigger>
    <button type="button">Save</button>
  </TooltipTrigger>
  <TooltipContent side="bottom">Saves your work automatically</TooltipContent>
</Tooltip>
```

Same API as [`@asnewyla/unstyled-tooltip`](https://www.npmjs.com/package/@asnewyla/unstyled-tooltip)
— `Tooltip` (`open`/`defaultOpen`/`onOpenChange`/`delay`), `TooltipTrigger`
(clones its single child), `TooltipContent` (`side`). This package only adds
the `xd-tooltip-root` / `xd-tooltip` classes and their CSS.

### Styling

The bubble is positioned absolutely against the trigger wrapper with an 8px
gap and a small arrow, placed by `data-side`. There is no collision detection:
a `side` that runs off-screen stays off-screen — pick the side with room.

Colors invert against the page (`--xd-color-text` background, `--xd-color-surface`
text) and read from `@asnewyla/tokens` when present, with built-in fallbacks.

```ts
import '@asnewyla/tokens/tokens.css'; // optional
import '@asnewyla/tooltip/styles.css'; // required
```

## License

MIT
